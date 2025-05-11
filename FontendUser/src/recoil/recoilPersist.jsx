export const saveAuthToStorage = (user, cart, orderId) => {
    try {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('ListCart', JSON.stringify(cart));
        localStorage.setItem('orderId', JSON.stringify(orderId)); // 👉 Thêm dòng này
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};


export const getAuthFromStorage = () => {
    const user = localStorage.getItem('user');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const cart = localStorage.getItem('ListCart');
    const orderId = localStorage.getItem('orderId'); // 👉 Thêm dòng này

    try {
        return {
            user: user ? JSON.parse(user) : null,
            isAuthenticated: isAuthenticated || false,
            cart: cart ? JSON.parse(cart) : [],
            orderId: orderId ? JSON.parse(orderId) : null, // 👉 Thêm dòng này
        };
    } catch (error) {
        console.error('Error parsing data from localStorage:', error);
        return { user: null, isAuthenticated: false, cart: [], orderId: null };
    }
};
