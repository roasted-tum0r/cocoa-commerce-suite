
export interface NewsletterState {
    loading: boolean;
    error: string | null;
    subscribed: boolean;
    message: string | null;
}

export const NewsletterInitialState: NewsletterState = {
    loading: false,
    error: null,
    subscribed: false,
    message: null,
};
