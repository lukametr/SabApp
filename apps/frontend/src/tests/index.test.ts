import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '@/contexts';
import { useDocumentStore } from '@/lib/store';
import { DocumentForm } from '@/components/DocumentForm';
import { DocumentList } from '@/components/DocumentList';
import { LoginPage } from '@/app/auth/login/page';
import { RegisterPage } from '@/app/auth/register/page';
import { DocumentsPage } from '@/app/documents/page';

// Mock the auth context
jest.mock('@/contexts', () => ({
  useAuth: jest.fn(),
}));

// Mock the document store
jest.mock('@/lib/store', () => ({
  useDocumentStore: jest.fn(),
}));

describe('DocumentForm', () => {
  it('renders the form correctly', () => {
    render(<DocumentForm />);
    expect(screen.getByLabelText(/სათაური/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/აღწერა/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ფაილი/i)).toBeInTheDocument();
  });

  it('submits the form with correct data', async () => {
    const mockAddDocument = jest.fn();
    (useDocumentStore as jest.Mock).mockReturnValue({
      addDocument: mockAddDocument,
      loading: false,
      error: null,
    });

    render(<DocumentForm />);

    fireEvent.change(screen.getByLabelText(/სათაური/i), {
      target: { value: 'Test Document' },
    });

    fireEvent.change(screen.getByLabelText(/აღწერა/i), {
      target: { value: 'Test Description' },
    });

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText(/ფაილი/i), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByText(/დამატება/i));

    await waitFor(() => {
      expect(mockAddDocument).toHaveBeenCalled();
    });
  });
});

describe('DocumentList', () => {
  it('renders the list correctly', () => {
    const mockDocuments = [
      {
        id: '1',
        title: 'Test Document 1',
        description: 'Test Description 1',
        fileUrl: 'test1.pdf',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        userId: '1',
      },
      {
        id: '2',
        title: 'Test Document 2',
        description: 'Test Description 2',
        fileUrl: 'test2.pdf',
        createdAt: '2024-01-02',
        updatedAt: '2024-01-02',
        userId: '1',
      },
    ];

    (useDocumentStore as jest.Mock).mockReturnValue({
      documents: mockDocuments,
      loading: false,
      error: null,
      fetchDocuments: jest.fn(),
      deleteDocument: jest.fn(),
    });

    render(<DocumentList />);

    expect(screen.getByText('Test Document 1')).toBeInTheDocument();
    expect(screen.getByText('Test Document 2')).toBeInTheDocument();
  });
});

describe('LoginPage', () => {
  it('renders the login form correctly', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      login: jest.fn(),
    });

    render(<LoginPage />);

    expect(screen.getByLabelText(/ელ-ფოსტა/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/პაროლი/i)).toBeInTheDocument();
    expect(screen.getByText(/შესვლა/i)).toBeInTheDocument();
  });
});

describe('RegisterPage', () => {
  it('renders the registration form correctly', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      register: jest.fn(),
    });

    render(<RegisterPage />);

    expect(screen.getByLabelText(/სახელი/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ელ-ფოსტა/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/პაროლი/i)).toBeInTheDocument();
    expect(screen.getByText(/რეგისტრაცია/i)).toBeInTheDocument();
  });
});

describe('DocumentsPage', () => {
  it('shows login required message when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
    });

    render(<DocumentsPage />);

    expect(screen.getByText(/ავტორიზაცია საჭიროა/i)).toBeInTheDocument();
  });

  it('shows documents when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: '1', name: 'Test User' },
      loading: false,
    });

    (useDocumentStore as jest.Mock).mockReturnValue({
      documents: [],
      loading: false,
      error: null,
      fetchDocuments: jest.fn(),
    });

    render(<DocumentsPage />);

    expect(screen.getByText(/დოკუმენტები/i)).toBeInTheDocument();
    expect(screen.getByText(/ახალი დოკუმენტი/i)).toBeInTheDocument();
  });
}); 