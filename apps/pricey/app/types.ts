export interface Product {
    name: string,
    seller: string,
    sellerId: string,
    storePageUrl: string,
    imageUrl: string,
    price: number,
}

export interface Game {
    id: string,
    date: Date,
    title: string,
    expensiveProduct: Product,
    normalProduct: Product,
}