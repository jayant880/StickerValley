
export const calculateCartTotal = (cart: any) => {
    const totalItems = cart.items.reduce((total: number, item: any) => total + item.quantity, 0);
    const totalAmount = cart.items.reduce((total: number, item: any) => total + item.sticker.price * item.quantity, 0);
    return { totalItems, totalAmount };

};