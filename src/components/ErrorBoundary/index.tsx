import { Component, ErrorInfo } from 'react';

interface Props {
    children?: React.JSX.Element | React.JSX.Element[]
}

interface State {
    hasError: boolean,
    error: Error | null,
    errorInfo: ErrorInfo | null,
}

export function logError(error: Error, errorInfo: ErrorInfo): void {
    console.error(`TrashScanner App - uncaught error!\n ${error}\n`); // NOSONAR
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true, error: _, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logError(error, errorInfo);
        this.setErrorInfo(errorInfo);
        setTimeout(() => this.clearError(this), 5000);
    }


    public setErrorInfo(errorInfo: ErrorInfo): void {
        this.setState((prevState: State) => ({
            ...prevState,
            errorInfo
        }));
    }

    public clearError(self: ErrorBoundary): void { // NOSONAR
        self.setState({ hasError: false, error: null, errorInfo: null });
    }

    public render() {
        return this.props.children;
    }
}

export default ErrorBoundary;
