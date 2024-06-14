import { Navigate, createBrowserRouter } from "react-router-dom";
import Calculator from "../components/Calculator";
import CalculateSensitivity from "../components/Calculator/CalculateSensitivity";
import ConvertGame from "../components/Calculator/ConvertGame";
import GptSuggestion from "../components/Calculator/GptSuggestion";
import Suggestion from "../components/Calculator/Suggestion";
import TranslateGame from "../components/Calculator/TranslateGame";
import Contact from "../components/Contact";
import Faq from "../components/Faq";
import FinalFeedback from "../components/FinalFeedback";
import Payment from "../components/Payment";
import Questions from "../components/Questions";
import Login from "../components/login.component";
import SignUp from "../components/signup.component";
import Social from "../components/social";
import { UserProvider } from "../context/UserContext";
import LayoutMain from "../layout/LayoutMain";
import PublicRoute from "../router/PublicRoute";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <UserProvider>
                <LayoutMain />
            </UserProvider>
        ),
        children: [
            {
                path: "login",
                element: (
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                ),
            },
            {
                path: "sign-in",
                element: (
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                ),
            },
            {
                path: "sign-up",
                element: (
                    <PublicRoute>
                        <SignUp />
                    </PublicRoute>
                ),
            },
            {
                path: "payment",
                element: (
                    <PrivateRoute>
                        <Payment />
                    </PrivateRoute>
                ),
            },
            {
                path: "contact",
                element: <Contact />,
            },
            {
                path: "faq",
                element: <Faq />,
            },
            {
                path: "calculator",
                element: (
                    <PrivateRoute>
                        <Calculator />
                    </PrivateRoute>
                ),
                children: [
                    { path: "", element: <Navigate to="calculate-sensitivity" /> },
                    {
                        path: "calculate-sensitivity",
                        element: (
                            <PrivateRoute>
                                <CalculateSensitivity />
                            </PrivateRoute>
                        ),
                    },
                    {
                        path: "chat",
                        element: (
                            <PrivateRoute>
                                <Suggestion />
                            </PrivateRoute>
                        ),
                    },
                    {
                        path: "translate-game",
                        element: (
                            <PrivateRoute>
                                <TranslateGame />
                            </PrivateRoute>
                        ),
                    },
                    {
                        path: "convert-game",
                        element: (
                            <PrivateRoute>
                                <ConvertGame />
                            </PrivateRoute>
                        ),
                    },
                    {
                        path: "gpt-suggestion",
                        element: (
                            <PrivateRoute>
                                <GptSuggestion />
                            </PrivateRoute>
                        ),
                    },
                ],
            },
            {
                path: 'questions',
                element: (
                    <PrivateRoute>
                        <Questions />
                    </PrivateRoute>
                ),
            },
            {
                path: "social",
                element: <Social />,
            },
            {
                path: "feedback",
                element: <FinalFeedback />,
            },
        ],
    },
]);

export default router;
