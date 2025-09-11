export const getImage = (name: string) => {
  switch(name.toLowerCase()) {
    case 'bread':
      return '/images/bread.png';
    case 'macbook':
      return '/images/macbook.png';
    case 'rice':
      return '/images/rice.png';
    case 's21':
      return '/images/s21.png';
    case 'image':
      return '/images/image.png';
    case 'image2':
      return '/images/image2.png';
    case 'image3':
      return '/images/image3.png';
    case 'image4':
      return '/images/image4.png';
    case 'image5':
      return '/images/image5.png';
    case 'image6':
      return '/images/image6.png';
    default:
      return '/images/image.png'; 
  }
}
