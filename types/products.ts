export interface IProduct {
  id: number
  name: string
  price: number
  weight: number
  weight_measure: string
  litre: number
  litre_measure: string
  main_image: string
  discount_price: null | number
  discount_percentage: null | number
  discount_type: string
  quantity: number
  max_quantity: number
  out_of_stock: boolean
  product_uom_amount: number
  product_uom: null | string
  thumbnails: {
    image_256: string
    image_512: string
    image_1024: string
  }
}
