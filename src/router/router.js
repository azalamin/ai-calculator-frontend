import { Navigate, createBrowserRouter } from "react-router-dom";
import Calculator from "../components/Calculator";
import CalculateSensitivity from "../components/Calculator/CalculateSensitivity";
import Chat from "../components/Calculator/Chat";
import ConvertGame from "../components/Calculator/ConvertGame";
import GptSuggestion from "../components/Calculator/GptSuggestion";
import TranslateGame from "../components/Calculator/TranslateGame";
import Contact from "../components/Contact";
import Faq from "../components/Faq";
import FinalFeedback from "../components/FinalFeedback";
import Payment from "../components/Payment";
import Login from "../components/login.component";
import SignUp from "../components/signup.component";
import Social from "../components/social";
import LayoutMain from "../layout/LayoutMain";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LayoutMain />,
        children: [
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "sign-in",
                element: <Login />,
            },
            {
                path: "sign-up",
                element: <SignUp />,
            },
            {
                path: "payment",
                element: <Payment />,
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
                element: <Calculator />,
                children: [
                    { path: "", element: <Navigate to="calculate-sensitivity" /> },
                    { path: "calculate-sensitivity", element: <CalculateSensitivity /> },
                    { path: "chat", element: <Chat /> },
                    { path: "translate-game", element: <TranslateGame /> },
                    { path: "convert-game", element: <ConvertGame /> },
                    { path: "gpt-suggestion", element: <GptSuggestion /> },
                ],
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
