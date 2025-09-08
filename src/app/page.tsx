'use client'
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation';
import { InputDemo } from '@/components/inputDemo';
import { Product } from '../../interfaces/api';
import { useEffect } from 'react';
import baseapi from '../../lib/axios';
import ProductCard from '@/components/productCard/page';
import Image from 'next/image';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { useState } from 'react';
import { FaRegHeart } from "react-icons/fa6";
import Link from 'next/link';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from 'sonner';
import { Description } from '@radix-ui/react-dialog';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Home() {
   const [search, setSearch] = useState('');
  
  const router = useRouter();

  const [open, setOpen] = useState(false);
  let timer: ReturnType<typeof setTimeout>;
  
  const handleSubmit = async(e:React.FormEvent)=> {
    console.log("icon clicked")
    e.preventDefault();
    router.push('/login')
  }

const handleCardClick = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    setOpen(true);
  }, 100); 

  // router.push('/login')
};
   
  return(
<div>
  <header>
   <nav className="w-full bg-white shadow px-6 py-4 flex items-center justify-between">
  
  <div className="flex items-center space-x-6">
    <span className="text-3xl font-bold text-gray-800">BB</span>
    <ul className="flex space-x-4 text-gray-700 font-medium">
      <li className="hover:text-blue-600 cursor-pointer">Home</li>
      <li className="hover:text-blue-600 cursor-pointer">Available</li>
    </ul>
  </div>

  
  <div>
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Services</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink asChild className="px-4 py-2 hover:bg-gray-100 block"><Link href="/login">Products</Link></NavigationMenuLink>
            <NavigationMenuLink  asChild className="px-4 py-2 hover:bg-gray-100 block"><Link href="/login">Category</Link></NavigationMenuLink>
            <NavigationMenuLink asChild className="px-4 py-2 hover:bg-gray-100 block"><Link href="/login"> Trending</Link></NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>


  <div className="flex items-center space-x-4">
            <InputDemo value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button onClick={handleSubmit}>Login</Button>
          </div>
  
</nav>

  </header>
<h1 className='flex text-3xl pt-0 text-red-300' >Available products</h1>
  <main className='mt-3'>
    <Popover>
      <PopoverTrigger asChild>
 
    <div className="grid grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-4" onClick={handleCardClick} >
   
   <Card className='hover:shadow-lg transition-all duration-300 transform hover:scale-105' 
   >
  <CardHeader>
    <CardTitle>{"Men's Jeans"}</CardTitle>
    <CardDescription>Imported form the Germany.Made up cutton, with the plasure experience.</CardDescription>
    <CardAction><FaRegHeart className="text-red-500 text-2xl cursor-pointer" /></CardAction>
  </CardHeader>
  <CardContent>
  <Image 
    src="/Images/image.png" 
    alt="jeans" 
    width={400}  
    height={250} 
    className="object-cover"
  />
</CardContent>
  <CardFooter className=' flex flex-col items-start space-y-1'>
    <p className='text-yellow-300 text-2xl '>Rs.399</p>
    <p className='line-through m'>Rs.1300</p>
    
  </CardFooter>
  
</Card>
   <Card className='hover:shadow-lg transition-all duration-300 transform hover:scale-105'>
  <CardHeader>
    <CardTitle>{"Men's Jeans"}</CardTitle>

    <CardDescription>Imported form the Germany.Made up cutton, with the plasure experience.</CardDescription>
    <CardAction><FaRegHeart className="text-red-500 text-2xl cursor-pointer" /></CardAction>
  </CardHeader>
  <CardContent>
    <Image 
    src="/Images/image2.png"
     alt="jeans"
     width={400}  
    height={250} 
    className="object-cover"
     />
  </CardContent>
  <CardFooter className=' flex flex-col items-start space-y-1'>
    <p className='text-yellow-300 text-2xl '>Rs.399</p>
    <p className='line-through m'>Rs.1300</p>
    
  </CardFooter>
  
</Card>
   <Card className='hover:shadow-lg transition-all duration-300 transform hover:scale-105'>
  <CardHeader>
   <CardTitle>{"Men's Jeans"}</CardTitle>

    <CardDescription>Imported form the Germany.Made up cutton, with the plasure experience.</CardDescription>
    <CardAction>
      <FaRegHeart className="text-red-500 text-2xl cursor-pointer" /></CardAction>
  </CardHeader>
  <CardContent>
    <Image src="/Images/image copy.png" alt="jeans"
    width={400}  
    height={250} />
  </CardContent>
  <CardFooter className=' flex flex-col items-start space-y-1'>
    <p className='text-yellow-300 text-2xl '>Rs.399</p>
    <p className='line-through m'>Rs.1300</p>
    
  </CardFooter>
  
</Card>
   <Card className='hover:shadow-lg transition-all duration-300 transform hover:scale-105'>
  <CardHeader>
    <CardTitle> Jeans</CardTitle>
    <CardDescription>Imported form the Germany.Made up cutton, with the plasure experience.</CardDescription>
    <CardAction><FaRegHeart className="text-red-500 text-2xl cursor-pointer" /></CardAction>
  </CardHeader>
  <CardContent>
    <Image src="/Images/image.png" alt="jeans"
    width={400}  
    height={250} />
  </CardContent>
  <CardFooter className=' flex flex-col items-start space-y-1'>
    <p className='text-yellow-300 text-2xl '>Rs.399</p>
    <p className='line-through m'>Rs.1300</p>
    
  </CardFooter>
  
</Card>
   <Card className='hover:shadow-lg transition-all duration-300 transform hover:scale-105'>
  <CardHeader>
    <CardTitle>{"Men's Jeans"}</CardTitle>

    <CardDescription>Imported form the Germany.Made up cutton, with the plasure experience.</CardDescription>
    <CardAction><FaRegHeart className="text-red-500 text-2xl cursor-pointer" /></CardAction>
  </CardHeader>
  <CardContent>
    <Image src="/Images/image copy 2.png" alt="jeans"
    width={400}  
    height={250} />
  </CardContent>
  <CardFooter className=' flex flex-col items-start space-y-1'>
    <p className='text-yellow-300 text-2xl '>Rs.399</p>
    <p className='line-through m'>Rs.1300</p>
    
  </CardFooter>
  
</Card>
   <Card className='hover:shadow-lg transition-all duration-300 transform hover:scale-105'>
  <CardHeader>
    <CardTitle>{"Men's Jeans"}</CardTitle>


    <CardDescription>Imported form the Germany.Made up cutton, with the plasure experience.</CardDescription>
    <CardAction><FaRegHeart className="text-red-500 text-2xl cursor-pointer" /></CardAction>
  </CardHeader>
  <CardContent>
    <Image src="/Images/image copy 3.png" alt="jeans"
    width={400}  
    height={250} />
  </CardContent>
  <CardFooter className=' flex flex-col items-start space-y-1'>
    <p className='text-yellow-300 text-2xl '>Rs.399</p>
    <p className='line-through m'>Rs.1300</p>
    
  </CardFooter>
  
</Card>
   <Card className='hover:shadow-lg transition-all duration-300 transform hover:scale-105'>
  <CardHeader>
    <CardTitle>{"Men's Jeans"}</CardTitle>

    <CardDescription>Imported form the Germany.Made up cutton, with the plasure experience.</CardDescription>
    <CardAction><FaRegHeart className="text-red-500 text-2xl cursor-pointer" /></CardAction>
  </CardHeader>
  <CardContent>
    <Image src="/Images/image copy 4.png" alt="jeans"
    width={400}  
    height={250} />
  </CardContent>
  <CardFooter className=' flex flex-col items-start space-y-1'>
    <p className='text-yellow-300 text-2xl '>Rs.399</p>
    <p className='line-through m'>Rs.1300</p>
    
  </CardFooter>
  
</Card>
    </div>
      </PopoverTrigger>
      <PopoverContent className="bg-white border border-red-300 text-center shadow-xl rounded-md p-4 text-sm text-red-600 transition-all duration-300 animate-fadeIn"
  sideOffset={10} >
<div className='text-red-500'>
  Login Required !! Please Login.
</div>
      </PopoverContent>
    </Popover>
    
  </main>
 
</div>

)

}
