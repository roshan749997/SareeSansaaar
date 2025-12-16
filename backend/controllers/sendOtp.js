import crypto from 'crypto';
import axios from 'axios';

// In-memory OTP store (Use Redis in production)
const otpStore = new Map();

/**
 * Generate a 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Hash OTP using SHA-256
 */
function hashOTP(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

/**
 * Send OTP via Fast2SMS
 */
export async function sendOtp(req, res) {
  try {
    // Accept both 'phone' and 'mobile' for compatibility
    let phone = (req.body.phone || req.body.mobile || '').toString().trim();

    // Validation
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    // Normalize phone number (remove all non-digits)
    phone = phone.replace(/\D/g, '');

    // Validate phone format (10 digits starting with 6-9)
    if (phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number. Must be 10 digits',
      });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number. Must start with 6, 7, 8, or 9',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store hashed OTP with expiry
    otpStore.set(phone, {
      hashedOTP,
      expiry,
    });

    // Send OTP via Fast2SMS
    // API URL must be EXACT with no trailing slash
    const fast2smsUrl = 'https://www.fast2sms.com/dev/bulkV2';
    const apiKey = process.env.FAST2SMS_API_KEY;

    console.log('[sendOtp] Starting OTP send process for phone:', phone);
    console.log('[sendOtp] API Key present:', !!apiKey);
    console.log('[sendOtp] Generated OTP:', otp);

    if (!apiKey) {
      console.error('[sendOtp] FAST2SMS_API_KEY is not set in environment variables');
      return res.status(500).json({
        success: false,
        message: 'SMS service configuration error. Please contact support.',
      });
    }

    try {
      // Create URLSearchParams for form-urlencoded format
      // Using Quick Route (route = "q") - NO DLT
      // Fast2SMS API format: route, message, numbers
      const params = new URLSearchParams();
      params.append('route', 'q'); // Quick route (no DLT)
      params.append('message', `Your SaariSanskar OTP is ${otp}. Valid for 5 minutes.`);
      params.append('numbers', phone); // Single number or comma-separated
      
      // Note: Fast2SMS expects authorization header with API key
      // Format: authorization: "YOUR_API_KEY" (not "Bearer YOUR_API_KEY")

      const requestBody = params.toString();
      console.log('[sendOtp] Request URL:', fast2smsUrl);
      console.log('[sendOtp] Request body:', requestBody);
      console.log('[sendOtp] Request headers:', {
        authorization: apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING',
        'Content-Type': 'application/x-www-form-urlencoded',
      });

      const smsResponse = await axios.post(
        fast2smsUrl,
        requestBody,
        {
          headers: {
            authorization: apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log('[sendOtp] Fast2SMS Response Status:', smsResponse.status);
      console.log('[sendOtp] Fast2SMS Response Data:', JSON.stringify(smsResponse.data, null, 2));

      // Check if SMS was sent successfully
      // Fast2SMS returns { return: true } on success
      if (smsResponse.data && smsResponse.data.return === true) {
        console.log('[sendOtp] OTP sent successfully to:', phone);
        return res.json({
          success: true,
          message: 'OTP sent successfully',
        });
      } else {
        // Check for error messages in response
        const errorMsg = smsResponse.data?.message || 
                        smsResponse.data?.msg || 
                        'Failed to send OTP';
        console.error('[sendOtp] Fast2SMS returned false:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (smsError) {
      // Properly log Fast2SMS errors from response.data
      console.error('[sendOtp] Fast2SMS Error occurred');
      
      if (smsError.response) {
        // Server responded with error status
        console.error('[sendOtp] Fast2SMS API Error Response:', {
          status: smsError.response.status,
          statusText: smsError.response.statusText,
          data: smsError.response.data,
          headers: smsError.response.headers,
        });
        
        // Remove OTP from store if SMS failed
        otpStore.delete(phone);
        
        // Extract error message from Fast2SMS response.data
        const errorMessage = smsError.response.data?.message || 
                             smsError.response.data?.msg || 
                             smsError.response.data?.error || 
                             `SMS service error (${smsError.response.status})`;
        
        return res.status(500).json({
          success: false,
          message: errorMessage,
        });
      } else if (smsError.request) {
        // Request was made but no response received
        console.error('[sendOtp] Fast2SMS API Error - No response received');
        console.error('[sendOtp] Request details:', {
          url: fast2smsUrl,
          timeout: smsError.code === 'ECONNABORTED' ? 'Request timeout' : 'Unknown',
        });
        
        // Remove OTP from store if SMS failed
        otpStore.delete(phone);
        
        return res.status(500).json({
          success: false,
          message: 'Unable to connect to SMS service. Please try again.',
        });
      } else {
        // Error in request setup
        console.error('[sendOtp] Fast2SMS API Error (setup):', smsError.message);
        console.error('[sendOtp] Error stack:', smsError.stack);
        
        // Remove OTP from store if SMS failed
        otpStore.delete(phone);
        
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP. Please try again.',
        });
      }
    }
  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

// Export otpStore for use in verifyOtp
export { otpStore, hashOTP };

