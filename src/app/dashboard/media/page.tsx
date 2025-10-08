/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadMediaSchema, type UploadMediaInput } from '@/lib/validations';
import { MediaFile, User } from '@/lib/types';
import { Plus, Search, MoreHorizontal, Trash2, Download, Copy, Eye, FileText, Image as ImageIcon, File } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Image from 'next/image';

interface MediaFileWithUser extends MediaFile {
  uploaded_by?: User;
}

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFileWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<MediaFileWithUser | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Upload form
  const uploadForm = useForm<UploadMediaInput>({
    resolver: zodResolver(uploadMediaSchema),
    defaultValues: {
      file_name: '',
      file_url: '',
      file_type: '',
      file_size_kb: 0,
      uploaded_by_user_id: '',
    },
  });

  // Fetch media files
  const fetchMediaFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/media');
      const result = await response.json();
      
      if (result.success) {
        setMediaFiles(result.data);
      } else {
        toast.error('Failed to fetch media files');
      }
    } catch (error) {
      toast.error('An error occurred while fetching media files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  // Upload file
  const onUploadFile = async (data: UploadMediaInput) => {
    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('File uploaded successfully');
        setIsUploadDialogOpen(false);
        uploadForm.reset();
        fetchMediaFiles();
      } else {
        toast.error(result.message || 'Failed to upload file');
      }
    } catch (error) {
      toast.error('An error occurred while uploading file');
    }
  };

  // Delete file
  const onDeleteFile = async () => {
    if (!selectedFile) return;

    try {
      const response = await fetch(`/api/media/${selectedFile.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('File deleted successfully');
        setIsDeleteDialogOpen(false);
        setSelectedFile(null);
        fetchMediaFiles();
      } else {
        toast.error(result.message || 'Failed to delete file');
      }
    } catch (error) {
      toast.error('An error occurred while deleting file');
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  // Open delete dialog
  const openDeleteDialog = (file: MediaFileWithUser) => {
    setSelectedFile(file);
    setIsDeleteDialogOpen(true);
  };

  // Open view dialog
  const openViewDialog = (file: MediaFileWithUser) => {
    setSelectedFile(file);
    setIsViewDialogOpen(true);
  };

  // Filter files based on search term
  const filteredFiles = mediaFiles.filter(file =>
    file.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.file_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get file icon
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return ImageIcon;
    } else if (fileType === 'application/pdf') {
      return FileText;
    } else {
      return File;
    }
  };

  // Format file size
  const formatFileSize = (sizeKB: number) => {
    if (sizeKB < 1024) {
      return `${sizeKB} KB`;
    } else if (sizeKB < 1024 * 1024) {
      return `${(sizeKB / 1024).toFixed(1)} MB`;
    } else {
      return `${(sizeKB / (1024 * 1024)).toFixed(1)} GB`;
    }
  };

  // Check if file is image
  const isImage = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  return (
    <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
      <DashboardLayout
        title="Media Library"
        description="Manage your media files and assets"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Media Library</h2>
              <p className="text-muted-foreground">
                Manage your media files and assets
              </p>
            </div>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload New File</DialogTitle>
                  <DialogDescription>
                    Add a new file to your media library.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={uploadForm.handleSubmit(onUploadFile)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file_name">File Name</Label>
                    <Input
                      id="file_name"
                      {...uploadForm.register('file_name')}
                      className={uploadForm.formState.errors.file_name ? 'border-red-500' : ''}
                    />
                    {uploadForm.formState.errors.file_name && (
                      <p className="text-sm text-red-500">
                        {uploadForm.formState.errors.file_name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file_url">File URL</Label>
                    <Input
                      id="file_url"
                      type="url"
                      {...uploadForm.register('file_url')}
                      className={uploadForm.formState.errors.file_url ? 'border-red-500' : ''}
                    />
                    {uploadForm.formState.errors.file_url && (
                      <p className="text-sm text-red-500">
                        {uploadForm.formState.errors.file_url.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="file_type">File Type</Label>
                      <Input
                        id="file_type"
                        {...uploadForm.register('file_type')}
                        className={uploadForm.formState.errors.file_type ? 'border-red-500' : ''}
                      />
                      {uploadForm.formState.errors.file_type && (
                        <p className="text-sm text-red-500">
                          {uploadForm.formState.errors.file_type.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file_size_kb">File Size (KB)</Label>
                      <Input
                        id="file_size_kb"
                        type="number"
                        {...uploadForm.register('file_size_kb', { valueAsNumber: true })}
                        className={uploadForm.formState.errors.file_size_kb ? 'border-red-500' : ''}
                      />
                      {uploadForm.formState.errors.file_size_kb && (
                        <p className="text-sm text-red-500">
                          {uploadForm.formState.errors.file_size_kb.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uploaded_by_user_id">Uploaded By User ID</Label>
                    <Input
                      id="uploaded_by_user_id"
                      {...uploadForm.register('uploaded_by_user_id')}
                      className={uploadForm.formState.errors.uploaded_by_user_id ? 'border-red-500' : ''}
                    />
                    {uploadForm.formState.errors.uploaded_by_user_id && (
                      <p className="text-sm text-red-500">
                        {uploadForm.formState.errors.uploaded_by_user_id.message}
                      </p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Upload File</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search media files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Media Files Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading ? (
              <div className="col-span-full text-center py-8">
                Loading media files...
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="col-span-full text-center py-8">
                No media files found
              </div>
            ) : (
              filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.file_type);
                return (
                  <Card key={file.id} className="overflow-hidden">
                    <div className="aspect-square relative bg-muted">
                      {isImage(file.file_type) ? (
                        <Image
                          src={file.file_url}
                          alt={file.file_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <FileIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm truncate" title={file.file_name}>
                          {file.file_name}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatFileSize(file.file_size_kb)}</span>
                          <Badge variant="outline">{file.file_type}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(file.created_at), 'MMM dd, yyyy')}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openViewDialog(file)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyToClipboard(file.file_url)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy URL
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a href={file.file_url} download target="_blank" rel="noopener noreferrer">
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(file)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* View File Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>File Details</DialogTitle>
                <DialogDescription>
                  Complete information about this media file.
                </DialogDescription>
              </DialogHeader>
              {selectedFile && (
                <div className="space-y-6">
                  {/* File Preview */}
                  <div className="flex justify-center">
                    {isImage(selectedFile.file_type) ? (
                      <div className="relative w-full max-w-md h-64">
                        <Image
                          src={selectedFile.file_url}
                          alt={selectedFile.file_name}
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-full max-w-md h-64 bg-muted rounded-lg flex items-center justify-center">
                        {(() => {
                          const FileIcon = getFileIcon(selectedFile.file_type);
                          return <FileIcon className="h-16 w-16 text-muted-foreground" />;
                        })()}
                      </div>
                    )}
                  </div>

                  {/* File Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">File Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Name:</span> {selectedFile.file_name}</p>
                        <p><span className="text-muted-foreground">Type:</span> {selectedFile.file_type}</p>
                        <p><span className="text-muted-foreground">Size:</span> {formatFileSize(selectedFile.file_size_kb)}</p>
                        <p><span className="text-muted-foreground">Uploaded:</span> {format(new Date(selectedFile.created_at), 'PPP')}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Upload Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Uploaded by:</span> {selectedFile.uploaded_by?.name || 'Unknown'}</p>
                        <p><span className="text-muted-foreground">User role:</span> {selectedFile.uploaded_by?.role || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>

                  {/* File URL */}
                  <div>
                    <h4 className="font-medium mb-2">File URL</h4>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={selectedFile.file_url}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(selectedFile.file_url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete File Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete File</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this file? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              {selectedFile && (
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">
                    File: <span className="font-medium">{selectedFile.file_name}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Type: <span className="font-medium">{selectedFile.file_type}</span>
                  </p>
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="destructive" onClick={onDeleteFile}>
                  Delete File
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
