'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const paymentMethodSchema = z.object({
  type: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'E_WALLET', 'BANK_TRANSFER']),
  provider: z.string().min(1, 'Provider is required'),
  card_number: z.string().optional(),
  expiry_month: z.number().min(1).max(12).optional(),
  expiry_year: z.number().min(new Date().getFullYear()).optional(),
  holder_name: z.string().optional(),
  is_default: z.boolean().optional(),
});

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentMethodFormData) => Promise<void>;
  initialData?: Partial<PaymentMethodFormData>;
  title: string;
  description: string;
}

export function PaymentMethodForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  description,
}: PaymentMethodFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: initialData?.type || 'CREDIT_CARD',
      provider: initialData?.provider || '',
      card_number: initialData?.card_number || '',
      expiry_month: initialData?.expiry_month || undefined,
      expiry_year: initialData?.expiry_year || undefined,
      holder_name: initialData?.holder_name || '',
      is_default: initialData?.is_default || false,
    },
  });

  const selectedType = watch('type');

  const onSubmitForm = async (data: PaymentMethodFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      reset();
      onClose();
      toast.success('Payment method saved successfully');
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error('Failed to save payment method');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const getProviderOptions = (type: string) => {
    switch (type) {
      case 'CREDIT_CARD':
        return ['Visa', 'Mastercard', 'American Express', 'Discover'];
      case 'DEBIT_CARD':
        return ['Visa Debit', 'Mastercard Debit', 'Maestro'];
      case 'E_WALLET':
        return ['GoPay', 'OVO', 'DANA', 'LinkAja', 'ShopeePay'];
      case 'BANK_TRANSFER':
        return ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB'];
      default:
        return [];
    }
  };

  const maskCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 16 digits
    const limited = digits.slice(0, 16);
    // Add spaces every 4 digits
    return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Payment Type</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setValue('type', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                <SelectItem value="DEBIT_CARD">Debit Card</SelectItem>
                <SelectItem value="E_WALLET">E-Wallet</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">Provider</Label>
            <Select
              value={watch('provider')}
              onValueChange={(value) => setValue('provider', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {getProviderOptions(selectedType).map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.provider && (
              <p className="text-sm text-destructive">{errors.provider.message}</p>
            )}
          </div>

          {(selectedType === 'CREDIT_CARD' || selectedType === 'DEBIT_CARD') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="card_number">Card Number</Label>
                <Input
                  id="card_number"
                  placeholder="1234 5678 9012 3456"
                  {...register('card_number')}
                  onChange={(e) => {
                    const masked = maskCardNumber(e.target.value);
                    setValue('card_number', masked);
                  }}
                />
                {errors.card_number && (
                  <p className="text-sm text-destructive">{errors.card_number.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry_month">Expiry Month</Label>
                  <Select
                    value={watch('expiry_month')?.toString()}
                    onValueChange={(value) => setValue('expiry_month', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.expiry_month && (
                    <p className="text-sm text-destructive">{errors.expiry_month.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry_year">Expiry Year</Label>
                  <Select
                    value={watch('expiry_year')?.toString()}
                    onValueChange={(value) => setValue('expiry_year', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.expiry_year && (
                    <p className="text-sm text-destructive">{errors.expiry_year.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="holder_name">Cardholder Name</Label>
                <Input
                  id="holder_name"
                  placeholder="John Doe"
                  {...register('holder_name')}
                />
                {errors.holder_name && (
                  <p className="text-sm text-destructive">{errors.holder_name.message}</p>
                )}
              </div>
            </>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={watch('is_default')}
              onCheckedChange={(checked) => setValue('is_default', checked as boolean)}
            />
            <Label htmlFor="is_default">Set as default payment method</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
