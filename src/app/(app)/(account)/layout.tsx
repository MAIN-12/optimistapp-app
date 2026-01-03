import OptimistHeader from "@/components/OptimistHeader";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div id="account-layout" className="w-full max-w-4xl mx-auto px-2 sm:px-6 pt-16 flex-grow min-h-screen mb-32  hidden-scrollbar">
            <OptimistHeader />
            <div className="w-full max-w-full">
                {children}
            </div>
        </div>
    );
}
