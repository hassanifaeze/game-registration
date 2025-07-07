import { useCallback, useEffect, useState } from "react";
import { FormField } from "./FormField";
import Button from "./ui/Button";
import Card from "./ui/Card/Card";
import CardContent from "./ui/Card/CardContent";
import CardHeader from "./ui/Card/CardHeader";
import { ChevronLeft, ChevronRight, Crown, Sword } from "./ui/Icon";
import Progress from "./ui/Progress";

// --- DynamicFormBuilder Component ---
export function DynamicFormBuilder({
  config: initialConfig,
  apiUrl,
  onSubmit,
}) {
  const [config, setConfig] = useState(initialConfig || null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepTransition, setStepTransition] = useState(false);
  const [message, setMessage] = useState(""); // For custom messages instead of alert

  // Load URL parameters into form data
  useEffect(() => {
    const params = {};
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.forEach((value, key) => {
      params[key] = value;
    });
    if (Object.keys(params).length) {
      setFormData((prev) => ({ ...prev, ...params }));
    }
  }, []);

  // Fetch form configuration from API
  useEffect(() => {
    if (!initialConfig && apiUrl) {
      const fetchConfig = async () => {
        setLoading(true);
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          setConfig(data.form?.register || data);
        } catch (error) {
          console.error("Failed to fetch form config:", error);
          setMessage("Failed to load form configuration.");
        } finally {
          setLoading(false);
        }
      };
      fetchConfig();
    }
  }, [apiUrl, initialConfig]);

  const validateField = useCallback(
    (field, value) => {
      if (field.required && (!value || value === "")) {
        return `${field.label} الزامی است`;
      }

      if (field.validation) {
        const { minLength, maxLength, pattern, matchField } = field.validation;

        if (minLength && value && value.length < minLength) {
          return `${field.label} باید حداقل ${minLength} کاراکتر باشد`;
        }

        if (maxLength && value && value.length > maxLength) {
          return `${field.label} باید حداکثر ${maxLength} کاراکتر باشد`;
        }

        if (pattern && value && !new RegExp(pattern).test(value)) {
          return `فرمت ${field.label} صحیح نیست`;
        }

        if (matchField && value !== formData[matchField]) {
          return `${field.label} با فیلد مرتبط مطابقت ندارد`;
        }
      }

      return null;
    },
    [formData]
  );

  const shouldShowField = useCallback(
    (field) => {
      if (!field.conditionalDisplay) return true;

      const { field: targetField, operator, value } = field.conditionalDisplay;
      const targetValue = formData[targetField];

      switch (operator) {
        case "equals":
          return targetValue === value;
        case "notEquals":
          return targetValue !== value;
        case "isEmpty":
          return !targetValue || targetValue === "";
        case "isNotEmpty":
          return targetValue && targetValue !== "";
        case "contains":
          return targetValue && targetValue.includes(value);
        default:
          return true;
      }
    },
    [formData]
  );

  const handleFieldChange = useCallback(
    (fieldId, value) => {
      setFormData((prev) => ({ ...prev, [fieldId]: value }));

      if (errors[fieldId]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldId];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleFieldAction = useCallback(
    async (fieldId, action) => {
      if (action === "sendOtp") {
        const mobile = formData.mobile;
        if (!mobile) {
          setErrors((prev) => ({
            ...prev,
            mobile: "ابتدا شماره موبایل را وارد کنید",
          }));
          return;
        }

        console.log("Sending OTP to:", mobile);
        setMessage("کد تایید ارسال شد"); // Custom message
      }
    },
    [formData]
  );

  const validateCurrentStep = useCallback(() => {
    if (!config) return false;

    const currentStepConfig = config.steps[currentStep];
    const stepErrors = {};

    currentStepConfig.fields.forEach((field) => {
      if (shouldShowField(field)) {
        const error = validateField(field, formData[field.id]);
        if (error) {
          stepErrors[field.id] = error;
        }
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }, [config, currentStep, formData, shouldShowField, validateField]);

  const handleNext = useCallback(() => {
    if (validateCurrentStep()) {
      setStepTransition(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setStepTransition(false);
      }, 300);
    }
  }, [validateCurrentStep]);

  const handlePrevious = useCallback(() => {
    setStepTransition(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev - 1);
      setStepTransition(false);
    }, 300);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!config || !validateCurrentStep()) return;

    setIsSubmitting(true);
    setMessage(""); // Clear previous messages

    try {
      const payload = {
        ...formData,
        ...config.fixedValues,
      };

      if (onSubmit) {
        await onSubmit(payload);
        setMessage("به ارتش جنگجویان خوش آمدید!");
      } else {
        const response = await fetch(config.submitUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setMessage("به ارتش جنگجویان خوش آمدید!");
        } else {
          throw new Error("خطا در ثبت‌نام");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setMessage("خطا در ثبت‌نام");
    } finally {
      setIsSubmitting(false);
    }
  }, [config, formData, validateCurrentStep, onSubmit]);

  if (loading) {
    return (
      <div className="bg-black/80 backdrop-blur-sm border-2 border-red-500/50 rounded-2xl p-12 text-center shadow-2xl shadow-red-500/20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-yellow-500 mx-auto"></div>
          <Sword className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-yellow-500 animate-pulse" />
        </div>
        <p className="mt-6 text-yellow-300 text-lg font-bold">
          آماده‌سازی میدان نبرد...
        </p>
      </div>
    );
  }

  if (!config) {
    return (
      <Card className="bg-black/80 border-red-500/50 shadow-2xl shadow-red-500/20">
        <CardContent className="p-12 text-center">
          <p className="text-red-400 text-lg font-bold">
            خطا در بارگذاری تنظیمات نبرد
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentStepConfig = config.steps[currentStep];
  const progress = ((currentStep + 1) / config.steps.length) * 100;
  const isLastStep = currentStep === config.steps.length - 1;

  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl shadow-red-500/20 gaming-card">
      {/* Progress Steps */}
      <div className="bg-gradient-to-r from-red-900/50 to-yellow-900/50 p-6 border-b border-red-500/30">
        <div className="flex items-center justify-between mb-4">
          {config.steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`md:w-14 md:h-14 w-10 h-10 rounded-full flex items-center justify-center text-xl font-black border-2 transition-all duration-500 transform hover:scale-110 ${
                  index <= currentStep
                    ? "bg-gradient-to-r from-red-600 to-yellow-500 text-black border-yellow-400 shadow-lg shadow-red-500/50 animate-pulse"
                    : "bg-gray-800 text-gray-400 border-gray-600"
                }`}
              >
                {step.icon || index + 1}
              </div>
              {index < config.steps.length - 1 && (
                <div
                  className={`md:w-32 w-16 h-2 mx-2 rounded-full transition-all duration-700 ${
                    index < currentStep
                      ? "bg-gradient-to-r from-red-600 to-yellow-500 shadow-lg shadow-red-500/50"
                      : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-3 bg-gray-800" />
        <p className="text-sm text-yellow-300 text-center mt-2 font-bold">
          مرحله {currentStep + 1} از {config.steps.length} - راه نبرد
        </p>
      </div>

      <CardHeader className="text-center pb-2 bg-gradient-to-b from-black/50 to-transparent">
        <div
          className={`transition-all duration-500 ${
            stepTransition
              ? "opacity-0 transform translate-x-10"
              : "opacity-100 transform translate-x-0"
          }`}
        >
          <h2 className="text-3xl font-black bg-gradient-to-r from-red-500 via-yellow-400 to-red-600 bg-clip-text text-transparent mb-2 drop-shadow-lg warrior-text">
            {currentStepConfig.title}
          </h2>
          {currentStepConfig.subtitle && (
            <p className="text-yellow-300 text-lg font-bold drop-shadow-md text-glow-yellow">
              {currentStepConfig.subtitle}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <div
          className={`space-y-6 transition-all duration-500 ${
            stepTransition
              ? "opacity-0 transform translate-x-10"
              : "opacity-100 transform translate-x-0"
          }`}
        >
          <div className="grid grid-cols-2 gap-6">
            {currentStepConfig.fields
              .filter(shouldShowField)
              .map((field, index) => (
                <div
                  key={field.id}
                  className={`${
                    field.gridColumn ? `col-span-1 flex justify-center items-end` : "col-span-2"
                  } transform transition-all duration-300 hover:scale-105`}
                  style={{
                    gridColumn: field.gridColumn || "span 2",
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <FormField
                    field={field}
                    value={formData[field.id]}
                    error={errors[field.id]}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    onAction={(action) => handleFieldAction(field.id, action)}
                  />
                </div>
              ))}
          </div>
        </div>

        {message && (
          <div className="mt-4 p-3 rounded-md bg-red-900/40 text-yellow-300 text-center font-bold animate-pulse text-glow-yellow">
            {message}
          </div>
        )}

        <div className="flex justify-between pt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300 transform hover:scale-105 font-bold power-Button"
          >
            <ChevronRight className="w-4 h-4 mr-2" />
            عقب‌نشینی
          </Button>

          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-black font-black shadow-lg shadow-red-500/50 hover:shadow-xl transition-all duration-300 px-8 transform hover:scale-105 power-Button"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2"></div>
                  در حال پیوستن...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  پیوستن به ارتش
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-black font-black shadow-lg shadow-red-500/50 hover:shadow-xl transition-all duration-300 px-8 transform hover:scale-105 power-Button"
            >
              حمله بعدی
              <ChevronLeft className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </div>
  );
}