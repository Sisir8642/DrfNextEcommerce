'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import * as z from 'zod'
import { Category } from '../../../../interfaces/api';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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


const categorySchema = z.object({
    name: z.string(). min(1, {message: "Provide a valid category name !!!"})
})

type categoryFormData = z.infer<typeof categorySchema>

export default function CategoryMangement(){
    const[categories, setCategories]= useState<Category[]>([])
    const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false); 
         const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const form = useForm<categoryFormData>({
        resolver: zodResolver(categorySchema), 
        defaultValues: {
            name: '',
        }
    })

    const fetchCategories = async() =>{
        setLoading(true)
        try{
            const response = await baseapi.get<Category[]>('/api/products/categories/')
            setCategories(response.data)
        } catch(error: any){
            console.log("Error fetching the data: ", error.message)
            toast('Error', {
                description: "failed to fetch the categories",
                className: 'bg-red-500 text-white',
            },
          
        )}
          setLoading(false);
    }

    useEffect(() =>{
        fetchCategories()
    }, [])


    const addCategory = async(data: categoryFormData)=> {
        console.log("Sending data to backend:", data)
        setIsSubmittingForm(true)
        
        try {
            await baseapi.post('/api/products/categories/', data)
            setIsDialogOpen(false);
            form.reset();
            fetchCategories(); 
            toast('Sucess', {
          description: 'Product updated successfully.',
        });
        } catch (error:any) {
            console.log('Failed to load categories', error.message)
        }
       setIsSubmittingForm(false)
    }

const editCategory = async (data: categoryFormData) => {
  setIsSubmittingForm(true);
  try {
    if (editingCategory) {
      await baseapi.patch(`/api/products/categories/${editingCategory.id}/`, data);
      toast('Success', {
        description: 'Category updated successfully.',
      });

      setIsDialogOpen(false);
      form.reset();
      setEditingCategory(null); 
      fetchCategories(); 
    }
  } catch (error: any) {
    console.log('Failed to update category:', error.response?.data || error.message);
    toast('Error', {
      description: `Failed to update category: ${error.response?.data?.detail || error.message}`,
    });
  }
  setIsSubmittingForm(false);
};

const handleEdit = (category: Category) =>{
    setEditingCategory(category);
    form.reset({
        name: category.name,
    })
    setIsDialogOpen(true)
}

const handleDelete = async(id:number) =>{
    if(!confirm(`Are you sure want to delete this product`)) return;
    try {
        await baseapi.delete(`/api/products/categories/${id}/`);
        toast('Delete',{
        description: 'Product deleted successfully.',
      });
      fetchCategories();

    } catch (error:any) {
        console.error('Failed to perform delete action', error.response?.data || error.message)
        toast('Error',{
        description: `Failed to delete product: ${error.response?.data?.detail || error.message}`,
        
      });
    }
    }

    const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingCategory(null);
      form.reset(); 
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <CgSpinner className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2">Loading categories...</span>
      </div>
    );
  }

     return(
      
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-50">Category Management</h2>
  <div className="flex justify-end mb-4">
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          {editingCategory ? 'Edit Category' : 'Add Category'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-gray-50">
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <DialogDescription>
            {editingCategory ? 'Modify the details of the selected category.' : 'Fill in the details for a new category.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((data) =>{
            if(editingCategory){
                editCategory(data)
            } else {
                addCategory(data)
            }
        })} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              {...form.register('name')}
              className="col-span-3 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
              defaultValue={editingCategory?.name || ''}
            />
            {form.formState.errors.name && (
              <p className="col-span-4 text-red-500 text-sm text-right">{form.formState.errors.name.message}</p>
            )}
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
        <TableHead className='text-right text-bold'>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {categories.length === 0 ? (
        <TableRow>
          <TableCell colSpan={2} className="h-24 text-center">No categories found.</TableCell>
        </TableRow>
      ) : (
        categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.id}</TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(category)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
                Delete
              </Button>
              
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
</div>

        
    )
}