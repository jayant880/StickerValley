import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import useOrder from '../hooks/useOrder';

interface SimulatedTrackingProps {
    createdAt: string | Date;
    orderId: string;
}

export const SimulatedTracking = ({ createdAt, orderId }: SimulatedTrackingProps) => {
    const [step, setStep] = useState(0);
    const orderDate = new Date(createdAt).getTime();
    const { useUpdateOrderStatusMutation } = useOrder();
    const { mutate: updateStatus } = useUpdateOrderStatusMutation();

    useEffect(() => {
        const calculateStep = () => {
            const now = Date.now();
            const diffInMinutes = (now - orderDate) / (1000 * 60);

            if (diffInMinutes >= 10) return 3; // Delivered
            if (diffInMinutes >= 5) return 2; // Shipped
            if (diffInMinutes >= 1) return 1; // Processing
            return 0; // Confirmed
        };

        const currentStep = calculateStep();
        setStep(currentStep);

        const syncBackend = (newStep: number) => {
            let status = 'PAID';
            if (newStep === 2) status = 'SHIPPED';
            if (newStep === 3) status = 'DELIVERED';

            if (status !== 'PAID') {
                updateStatus({ orderId, status });
            }
        };

        syncBackend(currentStep);

        const interval = setInterval(() => {
            const nextStep = calculateStep();
            if (nextStep !== step) {
                setStep(nextStep);
                syncBackend(nextStep);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [orderDate, orderId, step]);

    const steps = [
        {
            title: 'Order Confirmed',
            desc: 'Simulated artist notification sent',
            icon: Clock,
        },
        {
            title: 'Preparing Order',
            desc: 'Stickers are being packed (Mock)',
            icon: Package,
        },
        {
            title: 'In Transit',
            desc: 'Simulated delivery agent assigned',
            icon: Truck,
        },
        {
            title: 'Delivered',
            desc: 'Demo fulfillment complete!',
            icon: CheckCircle2,
        },
    ];

    return (
        <div className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold">
                    <Truck className="h-5 w-5 text-indigo-600" />
                    Simulated Tracking
                </h3>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-600 uppercase">
                    Demo Mode
                </span>
            </div>

            <div className="relative mx-auto w-fit space-y-8 before:absolute before:top-2 before:left-[19px] before:h-[calc(100%-24px)] before:w-0.5 before:bg-gray-100">
                {steps.map((s, i) => {
                    const isCompleted = step > i;
                    const isCurrent = step === i;

                    return (
                        <div key={i} className="relative flex gap-4 pr-4">
                            <div
                                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-white transition-colors duration-500 ${
                                    isCompleted
                                        ? 'border-green-500 bg-green-50 text-green-600'
                                        : isCurrent
                                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                                          : 'border-gray-200 text-gray-400'
                                }`}
                            >
                                <s.icon className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col justify-center text-left">
                                <p
                                    className={`font-bold transition-colors ${
                                        isCurrent || isCompleted ? 'text-gray-900' : 'text-gray-400'
                                    }`}
                                >
                                    {s.title}
                                </p>
                                <p className="text-muted-foreground text-xs">{s.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="rounded-xl bg-indigo-50/50 p-4 text-xs leading-relaxed text-indigo-700">
                <strong>Estimated Time:</strong> This is a simulated fulfillment process. It will
                take approximately 10 minutes to finish the entire order sequence.
            </div>
        </div>
    );
};
