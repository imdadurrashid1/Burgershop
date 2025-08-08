// Main admin panel functionality
document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements
    const loginForm = document.getElementById('adminLoginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Check if user is already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
        try {
            // Verify token is still valid
            const response = await fetch('/api/auth/verify', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const userData = JSON.parse(localStorage.getItem('adminUser') || '{}');
                if (userData.role === 'admin') {
                    showAdminPanel();
                    return;
                }
            }
            // If token is invalid or user is not admin, clear storage
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
        } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
        }
    }

    // Event Listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Initialize WebSocket for real-time updates
    initWebSocket();

    // Helper Functions
    async function showAdminPanel() {
        console.log('Showing admin panel');
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('logoutBtnContainer').style.display = 'block';
        
        const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
        if (user && user.name) {
            const adminNameEl = document.getElementById('adminName');
            if (adminNameEl) {
                adminNameEl.textContent = user.name;
            }
        }
        
        // Load initial data
        try {
            await window.loadOrders();
            // Commenting out other functions that might not be implemented yet
            // loadDashboardData();
            // loadMenuItems();
            // loadComboDeals();
            // loadReviews();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showMessage('Failed to load dashboard data: ' + error.message, 'danger');
        }
    }

    function showLoginForm() {
        console.log('Showing login form');
        document.getElementById('loginContainer').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('logoutBtnContainer').style.display = 'none';
    }

    function showMessage(message, type = 'info') {
        console.log(`[${type}] ${message}`);
        const messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `alert alert-${type}`;
            messageDiv.style.display = 'block';
            
            // Hide message after 5 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        } else {
            // Fallback to alert if message div not found
            window.alert(`[${type}] ${message}`);
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        console.log('Login form submitted');
        
        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('adminPassword').value;
        
        if (!email || !password) {
            showMessage('Please enter both email and password', 'danger');
            return;
        }

        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        try {
            console.log('Sending login request to /api/auth/login');
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            console.log('Login response status:', response.status);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed. Please check your credentials.');
            }
            
            if (!data.user || data.user.role !== 'admin') {
                throw new Error('Access denied. Admin privileges required.');
            }

            console.log('Login successful, storing token and user data');
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            
            // Show admin panel
            showAdminPanel();
            showMessage('Login successful!', 'success');
            
            // Clear the form
            loginForm.reset();
            
        } catch (error) {
            console.error('Login error:', error);
            showMessage(error.message || 'Login failed. Please try again.', 'danger');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    }

    function handleLogout() {
        console.log('Logging out');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        showLoginForm();
        showMessage('You have been logged out.', 'info');
    }

// Move loadOrders to global scope
window.loadOrders = async function() {
        console.log('Loading orders...');
        const token = localStorage.getItem('adminToken');
        const ordersContainer = document.getElementById('ordersContainer');
        
        if (!token) {
            showMessage('Please log in to view orders', 'warning');
            return;
        }

        if (!ordersContainer) {
            console.error('Orders container not found');
            return;
        }

        // Show loading state
        ordersContainer.innerHTML = `
            <div class="text-center my-4">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading orders...</span>
                </div>
                <p class="mt-2">Loading orders...</p>
            </div>`;

        try {
            const response = await fetch('/api/admin/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to load orders: ${response.status}`);
            }

            const orders = await response.json();
            console.log('Orders loaded:', orders);
            
            if (!Array.isArray(orders)) {
                throw new Error('Invalid orders data received');
            }

            if (orders.length === 0) {
                ordersContainer.innerHTML = '<div class="alert alert-info">No orders found.</div>';
                return;
            }

            // Create table for orders
            let tableHtml = `
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Phone</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Payment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            // Add each order to the table
            orders.forEach(order => {
                const orderDate = new Date(order.created_at || Date.now()).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                const statusClass = {
                    'pending': 'warning',
                    'processing': 'info',
                    'completed': 'success',
                    'cancelled': 'danger'
                }[order.status?.toLowerCase()] || 'secondary';

                // Format items list
                const itemsList = order.items?.map(item => 
                    `${item.quantity}x ${item.name} ($${item.price})`
                ).join('<br>') || 'No items';

                tableHtml += `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.customer_name || 'N/A'}</td>
                        <td>${order.customer_phone || 'N/A'}</td>
                        <td>${itemsList}</td>
                        <td>$${parseFloat(order.total_amount || 0).toFixed(2)}</td>
                        <td>
                            <span class="badge bg-${statusClass}">
                                ${order.status || 'pending'}
                            </span>
                        </td>
                        <td>${orderDate}</td>
                        <td>${order.payment_method?.toUpperCase() || 'N/A'}</td>
                        <td>
                            <button class="btn btn-sm btn-primary view-order" data-order-id="${order.id}">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </td>
                    </tr>
                `;
            });

            tableHtml += `
                        </tbody>
                    </table>
                </div>
            `;

            ordersContainer.innerHTML = tableHtml;
            
            // Add event listeners to view order buttons
            document.querySelectorAll('.view-order').forEach(button => {
                button.addEventListener('click', (e) => {
                    const orderId = e.target.closest('button').dataset.orderId;
                    viewOrderDetails(orderId);
                });
            });

        } catch (error) {
            console.error('Error loading orders:', error);
            const ordersContainer = document.getElementById('ordersContainer');
            if (ordersContainer) {
                ordersContainer.innerHTML = `
                    <div class="alert alert-danger">
                        Failed to load orders: ${error.message}
                    </div>
                `;
            }
        }
    }

    async function viewOrderDetails(orderId) {
        console.log('Viewing order details for:', orderId);
        // Implement order details modal or page
        alert(`Viewing order #${orderId}. This feature will be implemented next.`);
    }

    // Add print styles
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            .no-print {
                display: none !important;
            }
            .print-only {
                display: block !important;
            }
            .dashboard-card {
                break-inside: avoid;
            }
            canvas {
                max-width: 100% !important;
                height: auto !important;
            }
        }
    `;
    document.head.appendChild(style);
});

// Functions that need to be called from HTML (must be in global scope)
function showError(message) {
    console.error(message);
    alert(message);
}

function showSuccess(message) {
    console.log(message);
    alert(message);
}

function closeModal(modalId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    if (modal) modal.hide();
}
