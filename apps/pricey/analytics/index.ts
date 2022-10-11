// log the pageview with their URL
export const pageview = (url: string) => {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        page_path: url,
    });
};

// log specific events happening.
export const event = ({ action, params }: any) => {
    (window as any).gtag('event', action, params);
};

export function report_conversion(e: any, url: string) {
    e.preventDefault();
    let hasSubmitted = false;

    const callback = () => {
        if (hasSubmitted) {
            return;
        }
        hasSubmitted = true;
        if (typeof (url) !== 'undefined') {
            window.location = url as any;
        }
    };

    setTimeout(callback, 1000);


    (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-11000944639/8OR-CK-q1eQDEP-v1P0o',
        'event_callback': callback
    });
}
