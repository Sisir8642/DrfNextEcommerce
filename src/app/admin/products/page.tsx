'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import * as z from 'zod'
import { Product, Category } from '../../../../interfaces/api';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import baseapi from '../../../../lib/axios';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


const productSchema = z.object({
    name: z.string().min(1, {message: "Name should be minimum of 3 charecter"}),
    price: z.preprocess(
      (val) => parseFloat(z.string().parse(val)),
      z.number().positive({ message: "Price must be a positive number." })
    ) as z.ZodType<number, any, any>,
    description: z.string().optional(),
    is_active: z.boolean(),
    category: z.string().min(1, { message: "Category must be selected." }),

})

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductManagement(){
   const [products, setProducts] = useState<Product[]>([]);
     const [categories, setCategories] = useState<Category[]>([]);
     const [loading, setLoading] = useState<boolean>(true);
     const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
     const [editingProduct, setEditingProduct] = useState<Product | null>(null);
     const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false); 
   

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name:'', 
            price:1,
            description:'',
            is_active:true,
            category: '',
            
            


        }
    });

   const fetchProducts = async() =>{
        setLoading(true);
        try {
            const response = await baseapi.get<Product[]>('/api/products/products/');
            setProducts(response.data)
            console.log("fetched data:", response)
        } catch (error) {
            console.log('failed to load products from backend')
        toast('Error', {
          description: 'Failed to load products.',
          className: 'bg-red-500 text-white',
          });
        }finally {
      setLoading(false);
    }
        
    }

    const fetchCategories = async() =>{
        try {
            const response = await baseapi.get<Category[]>('/api/products/categories/')
            setCategories(response.data)
        } catch (error) {
            console.log('Failed to fetch the categories')
            toast('Error', {
                description: "failed to fetch the categories",
                className: 'bg-red-500 text-white',
            })
        }
    }

    useEffect(() =>{
        fetchProducts()
        fetchCategories()
        
    }, [])


    // useEffect(() =>{
    //   if (editingProduct){
    //     form.reset(editingProduct);
    //   }else {
    //     form.reset();
    //   }
    // },[editingProduct])


    const onSubmit = async (data: ProductFormData) => {
      setIsSubmittingForm(true);
    try {
      if (editingProduct) {
        await baseapi.patch(`/api/products/products/${editingProduct.id}/`, data);
        toast('Sucess', {
          description: 'Product updated successfully.',
        });
      } else {
        setEditingProduct(null) 
        form.reset()
        await baseapi.post('/api/products/products/', data);
        toast('Sucess',{
          description: 'Product added successfully.',
        });
        
      }
      setIsDialogOpen(false);
      form.reset(); 
      fetchProducts(); 
    } catch (error: any) {
      console.error('Failed to save product:', error.response?.data || error.message);
      toast('Error',{
        
        description: `Failed to save product: ${error.response?.data?.detail || error.message}`,
        
      });
    }setIsSubmittingForm(false);
  };

    const handleEdit = (product: Product) => {
      console.log('handleEdit: Product received for editing:', product);
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      is_active: product.is_active,
    });
    setIsDialogOpen(true);
  };

    const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await baseapi.delete(`/api/products/products/${id}/`);
      toast('Delete',{
        description: 'Product deleted successfully.',
      });
      fetchProducts();

    } catch (error: any) {
      console.log('Failed to delete product:', error.response?.data || error.message);
      toast('Error',{
        description: `Failed to delete product: ${error.response?.data?.detail || error.message}`,
        
      });
    }
  };

    const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingProduct(null);
      form.reset(); 
    }
  };

    if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <CgSpinner className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

     return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-50">Products Management</h2>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingProduct(null); 
                form.reset();               
                   }}
                >
            Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-gray-50">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Modify the product details.' : 'Fill in the details for a new product.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" {...form.register('name')} className="col-span-3 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600" />
                {form.formState.errors.name && <p className="col-span-4 text-red-500 text-sm text-right">{form.formState.errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input id="description" {...form.register('description')} className="col-span-3 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600" />
                {form.formState.errors.description && <p className="col-span-4 text-red-500 text-sm text-right">{form.formState.errors.description.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price</Label>
                <Input id="price" type="number" step="0.01" {...form.register('price')} className="col-span-3 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600" />
                {typeof form.formState.errors.price?.message === 'string' && (
                  <p className="col-span-4 text-red-500 text-sm text-right">{form.formState.errors.price?.message}</p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select
                  onValueChange={(value) => form.setValue('category', value)}
                  value={form.watch('category') ? String(form.watch('category')) : ''}
                >
                  <SelectTrigger className="col-span-3 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:text-gray-50">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && <p className="col-span-4 text-red-500 text-sm text-right">{form.formState.errors.category.message}</p>}
              </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_active" className="text-right">Is Active</Label>
                <Checkbox
                  id="is_active"
                  checked={form.watch('is_active')}
                  onCheckedChange={(checked) => form.setValue('is_active', Boolean(checked))}
                  className="col-span-3 justify-self-start"
                />
                {form.formState.errors.is_active && <p className="col-span-4 text-red-500 text-sm text-right">{form.formState.errors.is_active.message}</p>}
              </div>
             
              <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <CgSpinner className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">No products found.</TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                <TableCell className="max-w-[200px] truncate">{product.description || 'N/A'}</TableCell>
                <TableCell>{categories.find(cat => cat.id === Number(product.category))?.name || 'Unknown'}</TableCell>
                <TableCell>
                  <Badge variant={product.is_active ? 'default' : 'destructive'}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(product)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
