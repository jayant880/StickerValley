import { api } from "@/lib/axios"

export const downloadInvoice = async (orderId: string) => {
    try {
        const res = await api.get("/invoice/" + orderId, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${orderId}.pdf`);
        document.body.appendChild(link);
        link.click();

        if (link.parentNode) {
            link.parentNode.removeChild(link);
        }
        window.URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
