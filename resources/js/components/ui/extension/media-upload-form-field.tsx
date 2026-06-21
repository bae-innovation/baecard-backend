"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Control, FieldPath, FieldValues, useController } from "react-hook-form";
import { Upload, X, Image as ImageIcon, File } from "lucide-react";
import { z } from "zod";
import { DropzoneOptions, useDropzone, FileRejection } from "react-dropzone";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  useFileUpload,
} from "@/components/ui/extension/file-upload";

export interface MediaUploadFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  // RHF props
  name: TName;
  control: Control<TFieldValues>;

  // File configuration
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number; // in bytes
  multiple?: boolean;

  // Validation
  validationSchema?: z.ZodTypeAny;

  // Customization
  label?: string;
  description?: string;
  dropzoneContent?: React.ReactNode;
  previewComponent?: (file: File, index: number) => React.ReactNode;

  // Render prop for complete control
  render?: (props: {
    files: File[] | null;
    isDragActive: boolean;
    getRootProps: () => any;
    getInputProps: () => any;
    removeFile: (index: number) => void;
  }) => React.ReactNode;

  // Styling
  className?: string;
  dropzoneClassName?: string;
  previewClassName?: string;
}

/**
 * Helper function to check if a file is an image
 */
function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Type guard to check if a value is a File
 */
function isFile(value: unknown): value is File {
  return value instanceof File;
}

/**
 * Default preview component for image files
 */
function DefaultImagePreview({
  file,
  index,
  onRemove,
  className,
}: {
  file: File;
  index: number;
  onRemove: () => void;
  className?: string;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isImageFile(file)) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  if (!isImageFile(file)) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm",
          className,
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-md bg-muted">
          <File className="size-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={onRemove}
        >
          <X className="size-4" />
          <span className="sr-only">Remove file {index + 1}</span>
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative aspect-square overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      {previewUrl && (
        <img
          src={previewUrl}
          alt={file.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="truncate text-xs text-white">{file.name}</p>
      </div>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute right-2 top-2 size-7 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={onRemove}
      >
        <X className="size-4" />
        <span className="sr-only">Remove file {index + 1}</span>
      </Button>
    </div>
  );
}

/**
 * Default dropzone content
 * This component must be used inside FileUploader to access context
 */
function DefaultDropzoneContent({
  accept,
  maxSize,
}: {
  accept?: Record<string, string[]>;
  maxSize?: number;
}) {
  const { dropzoneState } = useFileUpload();
  const isDragActive = dropzoneState.isDragActive;

  const acceptedTypes = useMemo(() => {
    if (!accept) return "files";
    const types = Object.keys(accept);
    if (types.some((t) => t.startsWith("image/"))) return "images";
    if (types.some((t) => t.startsWith("video/"))) return "videos";
    if (types.some((t) => t.startsWith("audio/"))) return "audio";
    return "files";
  }, [accept]);

  const maxSizeMB = maxSize ? (maxSize / 1024 / 1024).toFixed(0) : "5";

  return (
    <div className="flex w-full flex-col items-center justify-center pb-4 pt-3">
      <Upload
        className={cn(
          "mb-2 size-8 transition-colors",
          isDragActive
            ? "text-primary"
            : "text-muted-foreground",
        )}
      />
      <p className="mb-1 text-sm text-muted-foreground">
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-muted-foreground">
        {acceptedTypes === "images" && "PNG, JPG, GIF, WebP"}
        {acceptedTypes === "videos" && "MP4, WebM, OGG"}
        {acceptedTypes === "audio" && "MP3, WAV, OGG"}
        {acceptedTypes === "files" && "Any file type"}
        {maxSize && ` up to ${maxSizeMB}MB`}
      </p>
    </div>
  );
}

export function MediaUploadFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  accept,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB default
  multiple = false,
  validationSchema,
  label,
  description,
  dropzoneContent,
  previewComponent,
  render,
  className,
  dropzoneClassName,
  previewClassName,
}: MediaUploadFormFieldProps<TFieldValues, TName>) {
  const [files, setFiles] = useState<File[] | null>(null);

  const {
    field,
  } = useController({
    name,
    control,
    rules: validationSchema
      ? {
          validate: (value) => {
            try {
              if (multiple) {
                const schema = z.array(validationSchema);
                schema.parse(value);
              } else {
                validationSchema.parse(value);
              }
              return true;
            } catch (err) {
              if (err instanceof z.ZodError) {
                return err.errors[0]?.message || "Validation failed";
              }
              return "Validation failed";
            }
          },
        }
      : undefined,
  });

  // Sync files with form field value
  useEffect(() => {
    if (field.value !== undefined) {
      if (Array.isArray(field.value)) {
        setFiles(field.value);
      } else if (isFile(field.value)) {
        setFiles([field.value]);
      } else if (field.value === null || field.value === "") {
        setFiles(null);
      }
    }
  }, [field.value]);

  // Update form field when files change
  const handleFilesChange = useCallback(
    (newFiles: File[] | null) => {
      setFiles(newFiles);
      if (multiple) {
        field.onChange(newFiles || []);
      } else {
        field.onChange(newFiles?.[0] || null);
      }
    },
    [field, multiple],
  );

  const removeFile = useCallback(
    (index: number) => {
      if (!files) return;
      const newFiles = files.filter((_, i) => i !== index);
      handleFilesChange(newFiles.length > 0 ? newFiles : null);
    },
    [files, handleFilesChange],
  );

  const dropzoneOptions: DropzoneOptions = useMemo(
    () => ({
      accept: accept || { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
      maxFiles,
      maxSize,
      multiple: multiple || maxFiles > 1,
    }),
    [accept, maxFiles, maxSize, multiple],
  );

  // Dropzone options for render prop (with onDrop handler)
  const dropzoneOptionsForRender: DropzoneOptions = useMemo(
    () => ({
      accept: accept || { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
      maxFiles,
      maxSize,
      multiple: multiple || maxFiles > 1,
      onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        const newFiles = files ? [...files] : [];
        const remainingSlots = maxFiles - newFiles.length;

        acceptedFiles.slice(0, remainingSlots).forEach((file) => {
          if (newFiles.length < maxFiles) {
            newFiles.push(file);
          }
        });

        handleFilesChange(newFiles.length > 0 ? newFiles : null);

        if (rejectedFiles.length > 0) {
          for (const rejection of rejectedFiles) {
            if (rejection.errors[0]?.code === "file-too-large") {
              toast.error(
                `File is too large. Max size is ${(maxSize / 1024 / 1024).toFixed(0)}MB`,
              );
              break;
            }
            if (rejection.errors[0]?.message) {
              toast.error(rejection.errors[0].message);
              break;
            }
          }
        }
      },
    }),
    [accept, maxFiles, maxSize, multiple, files, handleFilesChange],
  );

  // Always call useDropzone (hooks must be called unconditionally)
  const dropzoneStateForRender = useDropzone(
    render ? dropzoneOptionsForRender : { disabled: true },
  );

  // If render prop is provided, use it for complete control with direct dropzone integration
  if (render) {
    return (
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              {render({
                files,
                isDragActive: dropzoneStateForRender.isDragActive,
                getRootProps: dropzoneStateForRender.getRootProps,
                getInputProps: dropzoneStateForRender.getInputProps,
                removeFile,
              })}
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <FileUploader
              value={files}
              onValueChange={handleFilesChange}
              dropzoneOptions={dropzoneOptions}
              className={cn("w-full", className)}
            >
              <FileInput
                className={cn(
                  "rounded-lg border border-dashed border-input bg-background transition-colors hover:border-primary/50",
                  dropzoneClassName,
                )}
              >
                {dropzoneContent || (
                  <DefaultDropzoneContent
                    accept={accept}
                    maxSize={maxSize}
                  />
                )}
              </FileInput>

              {files && files.length > 0 && (
                <FileUploaderContent
                  className={cn(
                    "mt-2",
                    maxFiles > 1 && "grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4",
                    previewClassName,
                  )}
                >
                  {files.map((file, index) => {
                    if (previewComponent) {
                      return (
                        <div key={`${file.name}-${index}`}>
                          {previewComponent(file, index)}
                        </div>
                      );
                    }

                    return (
                      <div key={`${file.name}-${index}`}>
                        {isImageFile(file) && maxFiles > 1 ? (
                          <DefaultImagePreview
                            file={file}
                            index={index}
                            onRemove={() => removeFile(index)}
                            className="aspect-square"
                          />
                        ) : (
                          <FileUploaderItem index={index}>
                            <div className="flex items-center gap-2">
                              {isImageFile(file) ? (
                                <ImageIcon className="size-4 text-muted-foreground" />
                              ) : (
                                <File className="size-4 text-muted-foreground" />
                              )}
                              <span className="truncate text-sm">{file.name}</span>
                            </div>
                          </FileUploaderItem>
                        )}
                      </div>
                    );
                  })}
                </FileUploaderContent>
              )}
            </FileUploader>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
