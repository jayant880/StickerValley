

export function Dashboard() {
    return (
        <div className="text-center py-10">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Welcome to your dashboard</h2>
            <p className="text-lg text-gray-600 mb-12">Sticker marketplace coming soon!</p>

            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold mb-2">My Stickers</h3>
                    <p className="text-gray-500">You haven't uploaded any stickers yet.</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold mb-2">Recent Activity</h3>
                    <p className="text-gray-500">No recent activity to show.</p>
                </div>
            </div>
        </div>
    );
}
