import { createContext, getValidChildren } from "@chakra-ui/react-utils"
import {
  chakra,
  forwardRef,
  HTMLChakraProps,
  omitThemingProps,
  SystemStyleObject,
  ThemingProps,
  useMultiStyleConfig,
} from "@chakra-ui/system"
import { cx, Dict, filterUndefined, __DEV__ } from "@chakra-ui/utils"
import * as React from "react"

const [InputGroupStylesProvider, useInputGroupStyles] = createContext<
  Dict<SystemStyleObject>
>({
  name: `InputGroupStylesContext`,
  errorMessage: `useInputGroupStyles returned is 'undefined'. Seems you forgot to wrap the components in "<InputGroup />" `,
})

export { useInputGroupStyles }

export interface InputGroupProps
  extends HTMLChakraProps<"div">,
    ThemingProps<"Input"> {}

export const InputGroup = forwardRef<InputGroupProps, "div">((props, ref) => {
  const styles = useMultiStyleConfig("Input", props)
  const { children, className, ...rest } = omitThemingProps(props)

  const _className = cx("chakra-input__group", className)
  const groupStyles: InputGroupProps = {}

  const validChildren = getValidChildren(children)

  const input: any = styles.field

  validChildren.forEach((child: any) => {
    if (!styles) return

    if (input && child.type.id === "InputLeftElement") {
      groupStyles.paddingStart = input.height ?? input.h
    }

    if (input && child.type.id === "InputRightElement") {
      groupStyles.paddingEnd = input.height ?? input.h
    }

    if (child.type.id === "InputRightAddon") {
      groupStyles.borderEndRadius = 0
    }

    if (child.type.id === "InputLeftAddon") {
      groupStyles.borderStartRadius = 0
    }
  })

  const clones = validChildren.map((child: any) => {
    /**
     * Make it possible to override the size and variant from `Input`
     */

    const theming = filterUndefined({
      size: child.props?.size || props.size,
      variant: child.props?.variant || props.variant,
    })

    return child.type.id !== "Input"
      ? React.cloneElement(child, theming)
      : React.cloneElement(
          child,
          Object.assign(theming, groupStyles, child.props),
        )
  })

  return (
    <chakra.div
      className={_className}
      ref={ref}
      __css={{
        width: "100%",
        display: "flex",
        position: "relative",
      }}
      {...rest}
    >
      <InputGroupStylesProvider value={styles}>
        {clones}
      </InputGroupStylesProvider>
    </chakra.div>
  )
})

if (__DEV__) {
  InputGroup.displayName = "InputGroup"
}
