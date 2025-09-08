import React from 'react';
import { Product } from '../../../interfaces/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '@/components/ui/card';
import { FaRegHeart } from 'react-icons/fa6';
import { getImage } from '../ImagePath/page';
import CartSheet from '../AddToCart';
import Image from 'next/image';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <div className="w-full">
   
     <Card className='hover:shadow-lg transition-all duration-300 transform hover:scale-105' >
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
        <CardAction>
            <CartSheet triggerProduct={product} />
        </CardAction>
      </CardHeader>

      <CardContent>
        <Image
          src={getImage(product.name)}
          alt={product.name}
          className="w-full h-48 object-cover rounded"
          width={400}  
    height={250} 
        />
      </CardContent>

      <CardFooter className='flex flex-col items-start space-y-1'>
        <p className='text-yellow-300 text-2xl'>Rs. {product.price}</p>
        <p className='line-through text-gray-400'>Rs. {Number(product.price) * 1.5}</p>
        
      </CardFooter>
    </Card>

    </div>
  );
};



export default ProductCard;
