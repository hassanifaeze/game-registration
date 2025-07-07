import { useState } from "react";
import Button from "./ui/Button";
import Checkbox from "./ui/Checkbox";
import { Eye, EyeOff, Flame, RefreshCw, Shield, Zap } from "./ui/Icon";
import Input from "./ui/Input";
import Label from "./ui/Label";
import Select from "./ui/Select/Select";
import SelectContent from "./ui/Select/SelectContent";
import SelectItem from "./ui/Select/SelectItem";
import SelectTrigger from "./ui/Select/SelectTrigger";

const SelectValue = ({ children, placeholder }) => {
  return children || placeholder;
};


// --- FormField Component ---
export function FormField({ field, value, error, onChange, onAction }) {
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [otpValues, setOtpValues] = useState(
    new Array(field.length || 6).fill("")
  );
  const [isFocused, setIsFocused] = useState(false);

  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const handleOtpChange = (index, newValue) => {
    if (newValue.length > 1) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = newValue;
    setOtpValues(newOtpValues);
    onChange(newOtpValues.join(""));

    if (newValue && index < otpValues.length - 1) {
      const nextInput = document.getElementById(`otp-${field.id}-${index + 1}`);
      nextInput?.focus();
    }
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
        return (
          <div className="relative group">
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`
                bg-black/50 border-red-500/50 text-yellow-100 placeholder-gray-400
                focus:bg-black/70 focus:border-red-400 focus:ring-red-400/20
                transition-all duration-300 h-12 text-lg font-medium
                ${
                  error
                    ? "border-red-600 focus:border-red-600 focus:ring-red-600/30"
                    : ""
                }
                ${
                  isFocused
                    ? "shadow-lg shadow-red-500/30 transform scale-105"
                    : ""
                }
              `}
            />
            <div
              className={`absolute inset-0 rounded-md bg-gradient-to-r from-red-500/10 to-yellow-500/10 -z-10 transition-all duration-300 ${
                isFocused ? "opacity-100 scale-105" : "opacity-0 scale-95"
              }`}
            />
            {isFocused && (
              <Flame className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500 animate-pulse" />
            )}
          </div>
        );

      case "password":
        return (
          <div className="relative group">
            <Input
              id={field.id}
              type={showPassword ? "text" : "password"}
              placeholder={field.placeholder}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`
                bg-black/50 border-red-500/50 text-yellow-100 placeholder-gray-400
                focus:bg-black/70 focus:border-red-400 focus:ring-red-400/20
                transition-all duration-300 h-12 text-lg font-medium pr-12
                ${
                  error
                    ? "border-red-600 focus:border-red-600 focus:ring-red-600/30"
                    : ""
                }
                ${
                  isFocused
                    ? "shadow-lg shadow-red-500/30 transform scale-105"
                    : ""
                }
              `}
            />
            <Button
              type="Button"
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-red-500/20 transition-all duration-200 hover:scale-110"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-yellow-400" />
              ) : (
                <Eye className="h-4 w-4 text-yellow-400" />
              )}
            </Button>
            <div
              className={`absolute inset-0 rounded-md bg-gradient-to-r from-red-500/10 to-yellow-500/10 -z-10 transition-all duration-300 ${
                isFocused ? "opacity-100 scale-105" : "opacity-0 scale-95"
              }`}
            />
            {isFocused && (
              <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500 animate-pulse" />
            )}
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-3 space-x-reverse p-4 rounded-xl bg-black/30 border border-red-500/30 hover:bg-black/50 hover:border-red-400/50 transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <Checkbox
              id={field.id}
              checked={value || false}
              onCheckedChange={onChange}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-600 data-[state=checked]:to-yellow-500 border-2 border-red-500/50 transition-all duration-200"
            />
            <Label
              htmlFor={field.id}
              className="text-sm font-bold leading-none text-yellow-100 cursor-pointer"
            >
              {field.label}
            </Label>
          </div>
        );

      case "select":
        return (
          <Select className={`
                bg-black/50 border-red-500/50 text-yellow-100
                focus:bg-black/70 focus:border-red-400 focus:ring-red-400/20
                transition-all duration-300 h-12 text-lg font-medium hover:scale-105
                ${
                  error
                    ? "border-red-600 focus:border-red-600 focus:ring-red-600/30"
                    : ""
                }
              `} value={value || ""} onValueChange={onChange}>
            <SelectTrigger
              className={`
                bg-black/50 border-red-500/50 text-yellow-100
                focus:bg-black/70 focus:border-red-400 focus:ring-red-400/20
                transition-all duration-300 h-12 text-lg font-medium hover:scale-105
                ${
                  error
                    ? "border-red-600 focus:border-red-600 focus:ring-red-600/30"
                    : ""
                }
              `}
            >
              <SelectValue
                placeholder={field.placeholder || `انتخاب ${field.label}`}
              />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-red-500/50 text-yellow-100">
              {field.options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="hover:bg-red-900/50 focus:bg-red-900/50 transition-colors duration-200 font-medium"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "Button":
        return (
          <Button
            type="Button"
            variant={field.variant || "default"}
            onClick={() => onAction?.(field.action || "")}
            className={`
              w-full h-12 text-lg font-black transition-all duration-300 transform hover:scale-105
              ${
                field.variant === "outline"
                  ? "bg-black/30 border-red-500/50 text-yellow-300 hover:bg-red-900/30 hover:border-red-400"
                  : "bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-black shadow-lg shadow-red-500/30 hover:shadow-xl"
              }
            `}
          >
            <Zap className="w-4 h-4 mr-2" />
            {field.label}
          </Button>
        );

      case "captcha":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4 space-x-reverse">
              <div className="bg-gradient-to-r from-red-900/50 to-yellow-900/50 px-6 py-3 rounded-xl border-2 border-red-500/50 font-mono text-2xl tracking-wider font-black text-yellow-300 shadow-inner transition-all duration-300 hover:scale-105">
                {captchaCode}
              </div>
              <Button
                type="Button"
                variant="outline"
                size="sm"
                onClick={() => setCaptchaCode(generateCaptcha())}
                className="bg-black/30 border-red-500/50 text-yellow-300 hover:bg-red-900/30 h-12 w-12 p-0 transition-all duration-300 hover:scale-110"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <Input
                placeholder="کد امنیتی را وارد کنید"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className={`
                  bg-black/50 border-red-500/50 text-yellow-100 placeholder-gray-400
                  focus:bg-black/70 focus:border-red-400 focus:ring-red-400/20
                  transition-all duration-300 h-12 text-lg text-center font-bold
                  ${
                    error
                      ? "border-red-600 focus:border-red-600 focus:ring-red-600/30"
                      : ""
                  }
                `}
              />
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-400" />
            </div>
          </div>
        );

      case "otp":
        return (
          <div className="flex space-x-3 space-x-reverse justify-center">
            {otpValues.map((digit, index) => (
              <div
                key={index}
                className="transform transition-all duration-300 hover:scale-110"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Input
                  id={`otp-${field.id}-${index}`}
                  type="text"
                  InputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className={`
                    w-14 h-14 text-center text-2xl font-black
                    bg-black/50 border-2 border-red-500/50 text-yellow-300
                    focus:bg-black/70 focus:border-red-400 focus:ring-red-400/20
                    transition-all duration-300 rounded-xl hover:scale-105
                    ${
                      error
                        ? "border-red-600 focus:border-red-600 focus:ring-red-600/30"
                        : ""
                    }
                  `}
                />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (field.type === "checkbox") {
    return (
      <div className="space-y-3">
        {renderField()}
        {error && (
          <p className="text-sm text-red-400 font-bold animate-pulse">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (field.type === "Button") {
    return renderField();
  }

  return (
    <div className="space-y-3">
      {field.type !== "otp" && (
        <Label
          htmlFor={field.id}
          className="text-sm font-black text-yellow-300 drop-shadow-md"
        >
          {field.label}
          {field.required && <span className="text-red-400 mr-1">*</span>}
        </Label>
      )}
      {renderField()}
      {error && (
        <p className="text-sm text-red-400 font-bold flex items-center animate-pulse">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping"></span>
          {error}
        </p>
      )}
    </div>
  );
}