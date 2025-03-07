import {
  chakra,
  forwardRef,
  omitThemingProps,
  SystemStyleObject,
  ThemingProps,
  useMultiStyleConfig,
  HTMLChakraProps,
} from "@chakra-ui/system"
import { cx, Dict } from "@chakra-ui/utils"
import { createContext } from "@chakra-ui/react-utils"
import * as React from "react"
import { Spinner } from "@chakra-ui/spinner"
import { CheckIcon, InfoIcon, WarningIcon } from "./icons"

const STATUSES = {
  info: { icon: InfoIcon, colorScheme: "blue" },
  warning: { icon: WarningIcon, colorScheme: "orange" },
  success: { icon: CheckIcon, colorScheme: "green" },
  error: { icon: WarningIcon, colorScheme: "red" },
  loading: { icon: Spinner, colorScheme: "blue" },
}

export type AlertStatus = keyof typeof STATUSES

interface AlertContext {
  status: AlertStatus
}

const [AlertProvider, useAlertContext] = createContext<AlertContext>({
  name: "AlertContext",
  errorMessage:
    "useAlertContext: `context` is undefined. Seems you forgot to wrap alert components in `<Alert />`",
})

const [AlertStylesProvider, useAlertStyles] = createContext<
  Dict<SystemStyleObject>
>({
  name: `AlertStylesContext`,
  errorMessage: `useAlertStyles returned is 'undefined'. Seems you forgot to wrap the components in "<Alert />" `,
})

export { useAlertStyles }

interface AlertOptions {
  /**
   * The status of the alert
   * @default "info"
   */
  status?: AlertStatus
}

export interface AlertProps
  extends HTMLChakraProps<"div">,
    AlertOptions,
    ThemingProps<"Alert"> {
  addRole?: boolean
}

/**
 * Alert is used to communicate the state or status of a
 * page, feature or action
 */
export const Alert = forwardRef<AlertProps, "div">((props, ref) => {
  const { status = "info", addRole = true, ...rest } = omitThemingProps(props)
  const colorScheme = props.colorScheme ?? STATUSES[status].colorScheme

  const styles = useMultiStyleConfig("Alert", { ...props, colorScheme })

  const alertStyles: SystemStyleObject = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    ...styles.container,
  }

  return (
    <AlertProvider value={{ status }}>
      <AlertStylesProvider value={styles}>
        <chakra.div
          role={addRole ? "alert" : undefined}
          ref={ref}
          {...rest}
          className={cx("chakra-alert", props.className)}
          __css={alertStyles}
        />
      </AlertStylesProvider>
    </AlertProvider>
  )
})

export interface AlertTitleProps extends HTMLChakraProps<"div"> {}

export const AlertTitle = forwardRef<AlertTitleProps, "div">((props, ref) => {
  const styles = useAlertStyles()

  return (
    <chakra.div
      ref={ref}
      {...props}
      className={cx("chakra-alert__title", props.className)}
      __css={styles.title}
    />
  )
})

export interface AlertDescriptionProps extends HTMLChakraProps<"div"> {}

export const AlertDescription = forwardRef<AlertDescriptionProps, "div">(
  (props, ref) => {
    const styles = useAlertStyles()
    const descriptionStyles: SystemStyleObject = {
      display: "inline",
      ...styles.description,
    }

    return (
      <chakra.div
        ref={ref}
        {...props}
        className={cx("chakra-alert__desc", props.className)}
        __css={descriptionStyles}
      />
    )
  },
)

export interface AlertIconProps extends HTMLChakraProps<"span"> {}

export const AlertIcon: React.FC<AlertIconProps> = (props) => {
  const { status } = useAlertContext()
  const { icon: BaseIcon } = STATUSES[status]
  const styles = useAlertStyles()
  const css = status === "loading" ? styles.spinner : styles.icon

  return (
    <chakra.span
      display="inherit"
      {...props}
      className={cx("chakra-alert__icon", props.className)}
      __css={css}
    >
      {props.children || <BaseIcon h="100%" w="100%" />}
    </chakra.span>
  )
}
