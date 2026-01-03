import OptimistHeader from "@/components/OptimistHeader";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div id="public-layout" className="w-full max-w-full mx-auto flex-grow min-h-screen overflow-x-hidden hidden-scrollbar">
                {children}
        </div>
    );
}
