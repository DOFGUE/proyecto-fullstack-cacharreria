import { useState } from "react"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"
import { useAuth } from "../context/AuthContext"
import { getErrorMessage } from "../utils/catalog"
import "./AuthForm.css"

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const password = watch("password", "")

  const onSubmit = async (data) => {
    setError("")
    const { confirmPassword, ...payload } = data
    try {
      await registerUser(payload)
      toast.success("Cuenta creada correctamente")
      navigate("/perfil", { replace: true })
    } catch (requestError) {
      const message = getErrorMessage(requestError)
      setError(message)
      toast.error(message)
    }
  }

  return <PageLayout><PageHeader title="Crear cuenta" description="Regístrate para guardar tus datos y consultar tus pedidos." /><section className="section auth-section"><div className="container"><div className="auth-card"><span className="eyebrow">Únete a Casa Bonita</span><h2>Tu espacio empieza aquí</h2><p>Completa tus datos para crear una cuenta.</p>{error && <div className="form-error">{error}</div>}<form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate><div className="form-grid"><div className="form-field"><label htmlFor="username">Nombre</label><input id="username" autoComplete="given-name" {...register("username", { required: "El nombre es obligatorio" })} />{errors.username && <p className="field-error">{errors.username.message}</p>}</div><div className="form-field"><label htmlFor="lastName">Apellidos</label><input id="lastName" autoComplete="family-name" {...register("lastName")} /></div></div><div className="form-grid"><div className="form-field"><label htmlFor="email">Correo electrónico</label><input id="email" type="email" autoComplete="email" {...register("email", { required: "El correo es obligatorio", pattern: { value: /^\S+@\S+\.\S+$/, message: "Ingresa un correo válido" } })} />{errors.email && <p className="field-error">{errors.email.message}</p>}</div><div className="form-field"><label htmlFor="number">Teléfono</label><input id="number" type="tel" autoComplete="tel" {...register("number")} /></div></div><div className="form-field password-field"><label htmlFor="password">Contraseña</label><input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 5, message: "Debe tener al menos 5 caracteres" } })} /><button className="password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>{errors.password && <p className="field-error">{errors.password.message}</p>}</div><div className="form-field password-field"><label htmlFor="confirmPassword">Confirmar contraseña</label><input id="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" {...register("confirmPassword", { required: "Confirma tu contraseña", validate: (value) => value === password || "Las contraseñas no coinciden" })} />{errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}</div><button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="spin" size={16} /> Creando cuenta...</> : "Crear cuenta"}</button></form><p className="auth-footer">¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p></div></div></section></PageLayout>
}
