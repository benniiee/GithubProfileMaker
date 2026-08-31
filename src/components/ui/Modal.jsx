import React, { useEffect } from 'react';
import { Button } from './Primitives';
import { X, AlertTriangle } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div
        className={`relative w-full ${maxWidth} rounded-xl border border-border bg-card text-card-foreground shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 fade-in duration-150 flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between p-4 sm:p-5 border-b border-border/80 bg-muted/20">
            <div className="space-y-1 min-w-0 pr-3">
              {title && (
                <h3 className="text-sm font-semibold text-foreground tracking-tight truncate">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 rounded-md"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 text-xs">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg shrink-0 ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 px-3 text-xs">
            {cancelText}
          </Button>
          <Button
            variant={isDestructive ? 'destructive' : 'primary'}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="h-8 px-3 text-xs font-semibold"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

