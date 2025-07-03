import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { AlertTriangle, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"

const BrandedAlertDialog = AlertDialogPrimitive.Root

const BrandedAlertDialogTrigger = AlertDialogPrimitive.Trigger

const BrandedAlertDialogPortal = AlertDialogPrimitive.Portal

const BrandedAlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
BrandedAlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

interface BrandedAlertDialogContentProps 
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {
  variant?: "destructive" | "warning" | "default"
}

const BrandedAlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  BrandedAlertDialogContentProps
>(({ className, variant = "default", children, ...props }, ref) => {
  const getIconAndStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          icon: <Trash2 className="h-6 w-6 text-red-600" />,
          iconBg: "bg-red-50 border-red-100",
          titleColor: "text-red-900"
        }
      case "warning":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
          iconBg: "bg-amber-50 border-amber-100",
          titleColor: "text-amber-900"
        }
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-blue-600" />,
          iconBg: "bg-blue-50 border-blue-100",
          titleColor: "text-blue-900"
        }
    }
  }

  const { icon, iconBg, titleColor } = getIconAndStyles()

  return (
    <BrandedAlertDialogPortal>
      <BrandedAlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white border border-gray-100 shadow-2xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-xl overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Header with icon */}
        <div className="flex items-center gap-4 p-6 pb-4">
          <div className={cn("flex items-center justify-center w-12 h-12 rounded-full border", iconBg)}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type === BrandedAlertDialogHeader) {
                return React.cloneElement(child as React.ReactElement<any>, {
                  className: cn("space-y-1", child.props.className),
                  titleColor
                })
              }
              return null
            })}
          </div>
          <button
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={() => {
              // This will close the dialog
              const event = new CustomEvent('dismiss')
              document.dispatchEvent(event)
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type !== BrandedAlertDialogHeader) {
              return child
            }
            return null
          })}
        </div>
      </AlertDialogPrimitive.Content>
    </BrandedAlertDialogPortal>
  )
})
BrandedAlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

interface BrandedAlertDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  titleColor?: string
}

const BrandedAlertDialogHeader = ({
  className,
  titleColor,
  ...props
}: BrandedAlertDialogHeaderProps) => (
  <div
    className={cn("flex flex-col space-y-1", className)}
    {...props}
  />
)
BrandedAlertDialogHeader.displayName = "BrandedAlertDialogHeader"

const BrandedAlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3",
      className
    )}
    {...props}
  />
)
BrandedAlertDialogFooter.displayName = "BrandedAlertDialogFooter"

interface BrandedAlertDialogTitleProps 
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> {
  titleColor?: string
}

const BrandedAlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  BrandedAlertDialogTitleProps
>(({ className, titleColor = "text-gray-900", ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", titleColor, className)}
    {...props}
  />
))
BrandedAlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const BrandedAlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-600 leading-relaxed", className)}
    {...props}
  />
))
BrandedAlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

interface BrandedAlertDialogActionProps 
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> {
  variant?: "destructive" | "primary" | "default"
}

const BrandedAlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  BrandedAlertDialogActionProps
>(({ className, variant = "primary", ...props }, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
      case "primary":
        return "bg-[#393CA0] text-white hover:bg-[#2C2E7A] focus:ring-[#393CA0]"
      default:
        return "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500"
    }
  }

  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-6 py-2",
        getVariantStyles(),
        className
      )}
      {...props}
    />
  )
})
BrandedAlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const BrandedAlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 h-10 px-6 py-2",
      className
    )}
    {...props}
  />
))
BrandedAlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  BrandedAlertDialog,
  BrandedAlertDialogPortal,
  BrandedAlertDialogOverlay,
  BrandedAlertDialogTrigger,
  BrandedAlertDialogContent,
  BrandedAlertDialogHeader,
  BrandedAlertDialogFooter,
  BrandedAlertDialogTitle,
  BrandedAlertDialogDescription,
  BrandedAlertDialogAction,
  BrandedAlertDialogCancel,
}