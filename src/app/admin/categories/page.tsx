'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import * as z from 'zod';
import { Category } from '../../../../interfaces/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import baseapi from '../../../../lib/axios';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const categorySchema = z.object({
  name: z.string().min(1, { message: 'Provide a valid category name !!!' }),
});

type categoryFormData = z.infer<typeof categorySchema>;

export default function CategoryMangement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const form = useForm<categoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await baseapi.get<Category[]>('/api/products/categories/');
      setCategories(response.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Error fetching the data: ', error.message);
        toast('Error', {
          description: 'Failed to fetch categories',
          className: 'bg-red-500 text-white',
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (data: categoryFormData) => {
    setIsDialogOpen(false);
    form.reset();
    try {
      await baseapi.post('/api/products/categories/', data);
      fetchCategories();
      toast('Success', { description: 'Category added successfully.' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Failed to add category', error.message);
        toast('Error', { description: `Failed to add category: ${error.message}` });
      }
    }
  };

  const editCategory = async (data: categoryFormData) => {
    if (!editingCategory) return;

    try {
      await baseapi.patch(`/api/products/categories/${editingCategory.id}/`, data);
      toast('Success', { description: 'Category updated successfully.' });
      setEditingCategory(null);
      setIsDialogOpen(false);
      form.reset();
      fetchCategories();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Failed to update category:', error.message);
        toast('Error', { description: `Failed to update category: ${error.message}` });
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.reset({ name: category.name });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await baseapi.delete(`/api/products/categories/${id}/`);
      toast('Delete', { description: 'Category deleted successfully.' });
      fetchCategories();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to delete category', error.message);
        toast('Error', { description: `Failed to delete category: ${error.message}` });
      }
    }
  };

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

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-50">Category Management</h2>

      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>{editingCategory ? 'Edit Category' : 'Add Category'}</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:text-gray-50">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? 'Modify the details of the selected category.'
                  : 'Fill in the details for a new category.'}
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit((data) => {
                editingCategory ? editCategory(data) : addCategory(data);
              })}
              className="grid gap-4 py-4"
            >
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  className="col-span-3 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
                  defaultValue={editingCategory?.name || ''}
                />
                {form.formState.errors.name && (
                  <p className="col-span-4 text-red-500 text-sm text-right">
                    {form.formState.errors.name.message}
                  </p>
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
            <TableHead className="text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No categories found.
              </TableCell>
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
  );
}
