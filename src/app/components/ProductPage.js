import React, { useEffect, useState } from 'react';
import { 
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    Alert,
    CircularProgress 
 } from '@mui/material';

import { fetchDashboardAnalytics, fetchProductList } from '../../services/apiServices';
import { importProducts } from '../../api/products';
import { useRouter } from 'next/navigation';

const HomePage = () => {
    const [file, setFile] = useState(null);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [products, setProducts] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    // Check authentication on the client side
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.push('/auth/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    // In the dashboard page component
    useEffect(() => {
        if (isAuthenticated) {
            const loadDashboardData = async () => {
                try {
                    const analytics = await fetchDashboardAnalytics();
                    setAnalyticsData(analytics);
                } catch (error) {
                    console.error("Error fetching analytics:", error);
                    setUploadStatus({ type: 'error', message: 'Failed to load analytics data.' });
                }

                try {
                    const productData = await fetchProductList(currentPage);
                    setProducts(productData);
                    setTotalPages(productData.data.last_page);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching products:", error);
                    setLoading(false);
                    setUploadStatus({ type: 'error', message: 'Failed to load products data.' });
                }
            };
            
            loadDashboardData();
        }
    }, [isAuthenticated,currentPage]);

    // Render a loading state or redirect immediately if unauthenticated
    if (!isAuthenticated) return null;

    const handlePageChange = (event, page) => setCurrentPage(page);

    const handleFileChange = (event) => setFile(event.target.files[0]);

    const handleFileUpload = async () => {
        if (!file) {
            setUploadStatus({ type: 'error', message: 'Please select a file to upload.' });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setButtonLoading(true); // Start loading

        try {
            const response = await importProducts(formData);
            console.log(response);
            
            if (response.data.status === "success") {
                setUploadStatus({ type: 'success', message: response.data.message });
                fetchProductList(currentPage).then(data => setProducts(data));
                fetchDashboardAnalytics().then(data => setAnalyticsData(data));
            } else {
                const errorData = await response.json();
                setUploadStatus({ type: 'error', message: errorData.message || 'File upload failed.' });
            }
        } catch (error) {
            setUploadStatus({ type: 'error', message: 'An error occurred during file upload.' });
            console.error("Error uploading file:", error);
        }finally {
            setButtonLoading(false); // Stop loading
        }
    };
  
    return (
        <Box 
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f5f5f5" 
            sx={{ padding: 3 }}
        >

            {/* Analytics Cards */}
                {analyticsData ? (
                    <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                        <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                            <Typography variant="h6">Total Products</Typography>
                            <Typography variant="h5">{analyticsData.data?.products_count}</Typography>
                            </CardContent>
                        </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                            <Typography variant="h6">Last Product Inserted</Typography>
                            <Typography variant="h5">{analyticsData.data?.last_uploaded}</Typography>
                            </CardContent>
                        </Card>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="h6">Loading analytics data...</Typography>
                )}

            {/* Product Upload Picker */}
                <Box sx={{ marginBottom: 3,padding: 3 }}>
                    <Typography variant="h6">Import Products</Typography>
                    {uploadStatus && (
                        <Alert severity={uploadStatus.type} sx={{ marginBottom: 2 }}>
                            {uploadStatus.message}
                        </Alert>
                    )}
                    <TextField
                        type="file"
                        inputProps={{ accept: '.xlsx, .csv' }} // Accept .xlsx and .csv files
                        onChange={handleFileChange}
                        margin="normal"
                    />
                    <Button 
                        variant="contained" 
                        onClick={handleFileUpload} 
                        sx={{ marginLeft: 2,marginTop:3,padding:1,width:200,position: 'relative' }}
                        disabled={buttonLoading}
                        >
                       {buttonLoading ? <CircularProgress size={24} sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} /> : 'Upload'}
                    </Button>
                    <Box sx={{ marginTop: 2 }}>
                        <Button variant="outlined" href="public/product-excel.xlsx" download>
                            Download Sample File
                        </Button>
                    </Box>
                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                        Notes: Please upload a CSV file containing the product details. Ensure the file follows the required format.
                    </Typography>
                </Box>
    
            {/* Product List Table */}
                {loading ? ( // Check if loading
                    <Typography variant="h6">Loading products data...</Typography>
                ) : ( // If not loading
                <TableContainer component={Paper}>
                    <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Sku</TableCell>
                        <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products?.data.data?.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>{product.sku}</TableCell>
                            <TableCell>{product.description}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
                )}

            {/* Pagination Component */}
                {products && ( 
                    <Box display="flex" justifyContent="center" sx={{ marginTop: 3 }}>
                        <Pagination
                            count={totalPages} 
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                )}
        </Box>
    );
  };
  
  export default HomePage;