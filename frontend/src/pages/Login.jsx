import { useState } from "react"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"
import { useAuth } from "../context/AuthContext"
import { getErrorMessage } from "../utils/catalog"
import "./AuthForm.css"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    setError("")
    try {
      await login(data)
      toast.success("Sesión iniciada correctamente")
      navigate(location.state?.from?.pathname || "/perfil", { replace: true })
    } catch (requestError) {
      const message = getErrorMessage(requestError)
      setError(message)
      toast.error(message)
    }
  }

  return <PageLayout><PageHeader title="Iniciar sesión" description="Accede a tu cuenta de Casa Bonita." /><section className="section auth-section"><div className="container"><div className="auth-card"><span className="eyebrow">Tu cuenta</span><h2>Qué bueno verte</h2><p>Ingresa tus datos para continuar.</p>{error && <div className="form-error">{error}</div>}<form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate><div className="form-field"><label htmlFor="email">Correo electrónico</label><input id="email" type="email" autoComplete="email" {...register("email", { required: "El correo es obligatorio", pattern: { value: /^\S+@\S+\.\S+$/, message: "Ingresa un correo válido" } })} />{errors.email && <p className="field-error">{errors.email.message}</p>}</div><div className="form-field password-field"><label htmlFor="password">Contraseña</label><input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 5, message: "Debe tener al menos 5 caracteres" } })} /><button className="password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>{errors.password && <p className="field-error">{errors.password.message}</p>}</div><button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="spin" size={16} /> Iniciando...</> : "Iniciar sesión"}</button></form><p className="auth-footer">¿Aún no tienes cuenta? <Link to="/registro">Crear una cuenta</Link></p></div></div></section></PageLayout>
}
