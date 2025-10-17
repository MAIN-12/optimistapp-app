import OptimistHeader from "@/components/OptimistHeader";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="container mx-auto max-w-4xl pt-16 px-6 flex-grow min-h-screen bg-gray-50 mb-32">
            <OptimistHeader />
            {children}
        </section>
    );
}
