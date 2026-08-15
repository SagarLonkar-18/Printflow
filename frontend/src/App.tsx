import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import ShopSettingsPage from "./pages/ShopSettingsPage";
import ScrollToHash from "./components/ScrollToHash";

function App() {
	return (
		<BrowserRouter>
			<Toaster position="top-right" richColors />
			<ScrollToHash />
			<Routes>
				{/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route path="/shop/:slug" element={<UploadPage />} />
				<Route path="/order/:id" element={<OrderConfirmationPage />} />
				<Route path="/signup" element={<SignUpPage />} />
				<Route path="/dashboard/shop" element={<ProtectedRoute><ShopSettingsPage /></ProtectedRoute>} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
// deploy workflow test
