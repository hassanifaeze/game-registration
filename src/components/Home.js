import { DynamicFormBuilder } from "./DynamicFormBuilder";
import player from "../assets/image/samgag-artstation-thumbnail-blade-removebg-preview.png";

const Home = () => {
  const mockFormConfig = {
    form: {
      register: {
        steps: [
          {
            id: "step1",
            title: "اطلاعات جنگجو",
            subtitle: "آماده شدن برای نبرد",
            icon: "⚔️",
            fields: [
              {
                id: "firstName",
                type: "text",
                label: "نام جنگجو",
                placeholder: "نام خود را وارد کنید",
                required: true,
                validation: {
                  minLength: 2,
                  maxLength: 50,
                },
                gridColumn: "1/2",
              },
              {
                id: "lastName",
                type: "text",
                label: "نام خانوادگی",
                placeholder: "نام خانوادگی خود را وارد کنید",
                required: true,
                validation: {
                  minLength: 2,
                  maxLength: 50,
                },
                gridColumn: "2/3",
              },
              {
                id: "email",
                type: "email",
                label: "ایمیل نبرد",
                placeholder: "warrior@battlefield.com",
                required: true,
                validation: {
                  pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
                },
              },
              {
                id: "mobile",
                type: "text",
                label: "شماره تماس",
                placeholder: "09123456789",
                required: true,
                validation: {
                  pattern: "^09[0-9]{9}$",
                },
                gridColumn: "1/2",
              },
              {
                id: "sendOtp",
                type: "Button",
                label: "ارسال کد جنگی",
                variant: "outline",
                gridColumn: "2/3",
                action: "sendOtp",
              },
            ],
          },
          {
            id: "step2",
            title: "تایید هویت جنگجو",
            subtitle: "اثبات شایستگی برای ورود به میدان نبرد",
            icon: "🛡️",
            fields: [
              {
                id: "otpCode",
                type: "otp",
                label: "کد تایید جنگی",
                placeholder: "کد 6 رقمی را وارد کنید",
                required: true,
                length: 6,
                conditionalDisplay: {
                  field: "mobile",
                  operator: "isNotEmpty",
                },
              },
              {
                id: "password",
                type: "password",
                label: "رمز عبور قدرت",
                placeholder: "رمز عبور قوی خود را وارد کنید",
                required: true,
                validation: {
                  minLength: 8,
                  pattern:
                    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$",
                },
              },
              {
                id: "confirmPassword",
                type: "password",
                label: "تایید رمز قدرت",
                placeholder: "رمز عبور را مجدداً وارد کنید",
                required: true,
                validation: {
                  matchField: "password",
                },
              },
            ],
          },
          {
            id: "step3",
            title: "آماده‌سازی نهایی",
            subtitle: "تکمیل تجهیزات برای ورود به بازی",
            icon: "👑",
            fields: [
              {
                id: "country",
                type: "select",
                label: "قلمرو نبرد",
                required: true,
                options: [
                  { value: "IR", label: "ایران" },
                  { value: "US", label: "آمریکا" },
                  { value: "UK", label: "انگلستان" },
                ],
              },
              {
                id: "currency",
                type: "select",
                label: "واحد طلا",
                required: true,
                options: [
                  { value: "IRR", label: "💰 ریال" },
                  { value: "USD", label: "💵 دلار" },
                  { value: "EUR", label: "💶 یورو" },
                ],
                conditionalDisplay: {
                  field: "country",
                  operator: "equals",
                  value: "IR",
                },
              },
              {
                id: "captcha",
                type: "captcha",
                label: "چالش امنیتی",
                required: true,
              },
              {
                id: "agreeTerms",
                type: "checkbox",
                label: "قوانین میدان نبرد را می‌پذیرم",
                required: true,
              },
              {
                id: "newsletter",
                type: "checkbox",
                label: "اطلاع‌رسانی نبردهای جدید",
                required: false,
              },
            ],
          },
        ],
        fixedValues: {
          source: "web",
          version: "1.0",
        },
        submitUrl:
          "https://api.winazbet.com/v3/default/config",
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-black via-red-950 to-yellow-900 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Form Panel with Background Image on Mobile */}
        <div className="w-full md:w-1/2 relative overflow-hidden">
          {/* Background Image for Mobile */}
          <img
            src={player}
            alt="Gaming Warrior Character"
            className="absolute inset-0 w-full h-full object-cover md:hidden"
          />
          {/* Overlay to darken image a bit */}
          <div className="absolute inset-0 bg-black/40 md:hidden" />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-l to-transparent via-red-950/80 from-black/80 z-10" />

          {/* Form Content */}
          <div className="relative z-20 h-full flex items-center justify-center p-8">
            <div className="w-full max-w-lg">
              <DynamicFormBuilder
                config={mockFormConfig.form.register}
                apiUrl="https://716949ea-d279-411c-995f-b2207f7cff33.mock.pstmn.io/v3/default/config"
              />
            </div>
          </div>
        </div>

        {/* Desktop Only - Character Image */}
        <div className="hidden md:block md:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-red-900/50 to-transparent z-10" />
          <div className="relative flex h-full items-center justify-center">
            <img
              src={player}
              alt="Gaming Warrior Character"
              className="h-full w-full object-cover 
                     filter brightness-110 contrast-125 saturate-150"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
