
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

// Mock the useLanguage hook
jest.mock('@/contexts/LanguageContext', () => {
  const originalModule = jest.requireActual('@/contexts/LanguageContext');
  return {
    ...originalModule,
    useLanguage: jest.fn(),
  };
});

const mockUseLanguage = useLanguage as jest.MockedFunction<typeof useLanguage>;

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockUseLanguage.mockReturnValue({
      language: 'en',
      setLanguage: jest.fn(),
      translate: (translations) => (typeof translations === 'string' ? translations : translations['en']),
    });
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<LanguageProvider>{ui}</LanguageProvider>);
  };

  it('renders the language switcher button', () => {
    renderWithProvider(<LanguageSwitcher />);
    expect(screen.getByRole('button', { name: /change language/i })).toBeInTheDocument();
    expect(screen.getByRole('button').querySelector('svg')).toHaveClass('lucide-globe');
  });

  it('opens the dropdown menu when the button is clicked', () => {
    renderWithProvider(<LanguageSwitcher />);
    const button = screen.getByRole('button', { name: /change language/i });
    fireEvent.click(button);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('हिन्दी')).toBeInTheDocument();
  });

  it('calls setLanguage with "hi" when Hindi option is clicked', () => {
    const mockSetLanguage = jest.fn();
    mockUseLanguage.mockReturnValue({
      language: 'en',
      setLanguage: mockSetLanguage,
      translate: (translations) => (typeof translations === 'string' ? translations : translations['en']),
    });

    renderWithProvider(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /change language/i }));
    fireEvent.click(screen.getByText('हिन्दी'));
    expect(mockSetLanguage).toHaveBeenCalledWith('hi');
  });

  it('calls setLanguage with "en" when English option is clicked', () => {
    const mockSetLanguage = jest.fn();
    mockUseLanguage.mockReturnValue({
      language: 'hi', // Start with Hindi to test changing to English
      setLanguage: mockSetLanguage,
      translate: (translations) => (typeof translations === 'string' ? translations : translations['hi']),
    });
    
    renderWithProvider(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /change language/i }));
    fireEvent.click(screen.getByText('English'));
    expect(mockSetLanguage).toHaveBeenCalledWith('en');
  });

  it('highlights the currently selected language', () => {
    mockUseLanguage.mockReturnValue({
      language: 'hi',
      setLanguage: jest.fn(),
      translate: (translations) => (typeof translations === 'string' ? translations : translations['hi']),
    });

    renderWithProvider(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /change language/i }));
    
    const hindiOption = screen.getByText('हिन्दी');
    // Shadcn applies 'bg-accent' class for selected items in dropdown
    // This test might be brittle if the exact class name changes in shadcn,
    // but it's a common way to check styling.
    expect(hindiOption).toHaveClass('bg-accent'); 
    expect(screen.getByText('English')).not.toHaveClass('bg-accent');
  });
});
