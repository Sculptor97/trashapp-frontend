import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning' | 'info';
  isLoading?: boolean;
}

const variantConfig = {
  default: {
    icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
    confirmButton: 'bg-blue-600 hover:bg-blue-700',
  },
  destructive: {
    icon: <XCircle className="h-6 w-6 text-red-600" />,
    confirmButton: 'bg-red-600 hover:bg-red-700',
  },
  warning: {
    icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
    confirmButton: 'bg-orange-600 hover:bg-orange-700',
  },
  info: {
    icon: <Info className="h-6 w-6 text-blue-600" />,
    confirmButton: 'bg-blue-600 hover:bg-blue-700',
  },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {config.icon}
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn('w-full sm:w-auto text-white', config.confirmButton)}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook for easy usage
export function useConfirmDialog() {
  const [dialogState, setDialogState] = React.useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: (() => void) | null;
    variant?: 'default' | 'destructive' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: null,
  });

  const showConfirm = (options: {
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: 'default' | 'destructive' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
  }) => {
    setDialogState({
      isOpen: true,
      ...options,
    });
  };

  const hideConfirm = () => {
    setDialogState(prev => ({
      ...prev,
      isOpen: false,
      onConfirm: null,
    }));
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      onClose={hideConfirm}
      onConfirm={dialogState.onConfirm || (() => {})}
      title={dialogState.title}
      description={dialogState.description}
      variant={dialogState.variant}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
      isLoading={dialogState.isLoading}
    />
  );

  return {
    showConfirm,
    hideConfirm,
    ConfirmDialog: ConfirmDialogComponent,
  };
}
