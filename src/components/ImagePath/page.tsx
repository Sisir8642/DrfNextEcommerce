export const getImage =(name:string) =>{
    switch(name.toLowerCase()){
        case 'bread':
            return '/images/bread.png'
        case 'macbook':
            return '/images/macbook.png'
        case 'rice':
            return '/images/rice.png'
        case 'hello':
            return 'images/image copy 2.png'
            
        case 's21':
            return '/images/s21.png'
        default:
            return '/images/image.png'
    }
}