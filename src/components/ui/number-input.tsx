import { NumberInput as ChakraNumberInput } from "@chakra-ui/react"
import * as React from "react"
import { isMobile } from "react-device-detect"
export interface NumberInputProps extends ChakraNumberInput.RootProps {}

export const NumberInputRoot = React.forwardRef<
  HTMLDivElement,
  NumberInputProps
>(function NumberInput(props, ref) {
  const { children, ...rest } = props
  return (
    <ChakraNumberInput.Root ref={ref} variant="outline" {...rest}>
      {children}
      <ChakraNumberInput.Control mt={isMobile?7:8} mr={isMobile? "17%": "30%"}>
        <ChakraNumberInput.IncrementTrigger />
        <ChakraNumberInput.DecrementTrigger />
      </ChakraNumberInput.Control>
    </ChakraNumberInput.Root>
  )
})

export const NumberInputField = ChakraNumberInput.Input
export const NumberInputScruber = ChakraNumberInput.Scrubber
export const NumberInputLabel = ChakraNumberInput.Label
