'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ButtonCs from '@/components/ui/custom/ButtonCs';

type NativeButtonType = React.ButtonHTMLAttributes<HTMLButtonElement>['type'];

type DialogActionBtnProps = {
  type?: NativeButtonType;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
};

type CheckOutModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
  headerProps: {
    title: string;
    description: string;
  };
  okBtnProps?: DialogActionBtnProps;
  cancelBtnProps?: DialogActionBtnProps;
  footer?: boolean;
};

export function DialogFooterCs({
  onOpenChange,
  okBtnProps,
  cancelBtnProps,
}: Pick<CheckOutModalProps, 'onOpenChange' | 'okBtnProps' | 'cancelBtnProps'>) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <ButtonCs
        type={cancelBtnProps?.type || 'button'}
        variant="outline"
        onClick={
          cancelBtnProps?.onClick
            ? () => cancelBtnProps?.onClick?.()
            : () => onOpenChange(false)
        }
        disabled={cancelBtnProps?.disabled}
        isLoading={cancelBtnProps?.isLoading}
      >
        {cancelBtnProps?.children ?? 'Cerrar'}
      </ButtonCs>
      <ButtonCs
        type={okBtnProps?.type || 'button'}
        onClick={okBtnProps?.onClick ? () => okBtnProps?.onClick?.() : () => {}}
        disabled={okBtnProps?.disabled}
        isLoading={okBtnProps?.isLoading}
      >
        {okBtnProps?.children ?? 'Aceptar'}
      </ButtonCs>
    </div>
  );
}

export function DialogCs({
  open,
  onOpenChange,
  headerProps,
  okBtnProps,
  cancelBtnProps,
  children,
  footer = true,
}: CheckOutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{headerProps.title}</DialogTitle>
          <DialogDescription>{headerProps.description}</DialogDescription>
        </DialogHeader>
        {children}
        {footer && (
          <DialogFooterCs
            onOpenChange={onOpenChange}
            okBtnProps={okBtnProps}
            cancelBtnProps={cancelBtnProps}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
