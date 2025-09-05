'use client'
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import  { fetchProducts } from '../../../lib/axios';
import { Product } from '../../../interfaces/api';
import ProductCard from '@/components/productCard/page';
import AddToCart from '../AddToCart/page ';

export function InputDemo({value, onChange}: {value:string; onChange:(e: React.ChangeEvent<HTMLInputElement>) => void}) {
  return <Input type="text" placeholder="Search ..." value={value} onChange={onChange} />
}

const Customer = () => {
  const[products, setProducts] = useState<Product[]>([])
   const [loading, setLoading] = useState<boolean>(false);
   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

   useEffect(() =>{
    const loadProducts = async() => {
      setLoading(true);

      try {
        const data = await fetchProducts()
        setProducts(data.filter(p=>p.is_active));
        console.log("fetched data", data)
      } catch (error) {
        console.error('Failed to load products:', error);
        toast('Error', {
          description: 'Failed to load products.',
          className: 'bg-red-500 text-white',
        });
        
      }finally{
        setLoading(false)
      }
    }
    loadProducts()
   }, [])

  const router = useRouter();

   useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);
  
  const handleSubmit = async(e:React.FormEvent)=> {
    console.log("icon clicked")
    e.preventDefault();
    router.push('/')
  }

   const handleCardClick= async(e:React.FormEvent) =>{
    alert("Login required to porform action!!")

    console.log("Card clicked")
    router.push('/login')
    
  }


  return (
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
                <NavigationMenuLink className="px-4 py-2 hover:bg-gray-100 block">Products</NavigationMenuLink>
                <NavigationMenuLink className="px-4 py-2 hover:bg-gray-100 block">Category</NavigationMenuLink>
                <NavigationMenuLink className="px-4 py-2 hover:bg-gray-100 block">Popular</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    
    
      <div className=" flex items-center space-x-4">
        <AddToCart />
        <InputDemo value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button onClick={handleSubmit}>Logout</Button>
      </div>
    </nav>
    
      </header>

      <main>
        <h1 className='flex justify-end mr-2 text-2xl animate-caret-blink'>Welcome to Shopping !</h1>

    <h1 className='flex text-3xl pt-0 text-red-300' >Available products</h1>
  
   <div>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-4 mt-6">
              {filteredProducts.length === 0 ? (
                <p className="text-gray-500 col-span-full">No products found.</p>
              ) : (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          )}
        </div>


      </main>
      </div>
      
  )
  
}

export default Customer

