const calculateValue = (price, stock) => {
    if(price < 0 || stock < 0) return 0;
    return price * stock;
}

const applyDiscount = (price, discountPercent) => {
    if(price < 0 || discountPercent < 0 || discountPercent > 100) return price;
    return price * (1 - discountPercent / 100);
}

const isLowStock = (stock, threshold = 10) => {
    return stock <= threshold;
}

module.exports = { calculateValue, applyDiscount, isLowStock };