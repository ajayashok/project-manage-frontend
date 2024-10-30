import { fetchProducts,fetchAnalytics } from '../api/products';

export async function fetchDashboardAnalytics() {
    try {
        const response = await fetchAnalytics();
        if (response.status === 200) {
            const analyticsData = response.data;
            return analyticsData;
        } else {
            console.warn("Unexpected status:", response.status);
            return null;
        }
    }catch (error) {
        console.error("Error fetching analytics:", error.message);
        throw error;
    }
}
  
export async function fetchProductList(currentPage) {
    try{
        const response = await fetchProducts(currentPage);
        if (response.status === 200) {
            const productData = response.data;
            return productData;
        } else {
            console.warn("Unexpected status:", response.status);
            return null;
        }
    }catch(error){
        console.error("Error fetching analytics:", error.message);
        throw error;
    }
}