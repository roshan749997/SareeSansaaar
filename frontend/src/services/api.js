const API_URL = 'http://localhost:5000/api';

export const fetchSarees = async (category) => {
  try {
    const response = await fetch(`${API_URL}/products${category ? `?category=${encodeURIComponent(category)}` : ''}`);
    if (!response.ok) {
      throw new Error('Failed to fetch sarees');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sarees:', error);
    throw error;
  }
};

export const fetchSareeById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch saree details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching saree details:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/header`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.navigation.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await fetch(`${API_URL}/header/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};
