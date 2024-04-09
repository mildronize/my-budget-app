"use client";

import * as React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import TextField from "@mui/material/TextField";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix="฿ "
      />
    );
  }
);

interface CurrencyTextFieldProps {
    label?: string;
}

export function CurrencyTextField(props: CurrencyTextFieldProps) {
  const [values, setValues] = React.useState({
    numberformat: "0",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <TextField
      label={props.label || "Amount"}
      fullWidth
      value={values.numberformat}
      onChange={handleChange}
      name="numberformat"
      id="formatted-numberformat-input"
      InputProps={{
        inputComponent: NumericFormatCustom as any,
      }}
      variant="outlined"
    />
  );
}