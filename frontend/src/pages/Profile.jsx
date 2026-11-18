import { useEffect, useState } from "react"
import { LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"
import { useAuth } from "../context/AuthContext"
import { getErrorMessage } from "../utils/catalog"
import "./AuthForm.css"

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [error, setError] = useState("")
  const [loaded, setLoaded] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  useEffect(() => {
    if (user && !loaded) {
      reset({ username: user.username || "", lastName: user.lastName || "", email: user.email || "", number: user.number || "" })
      setLoaded(true)
    }
  }, [loaded, reset, user])

  const onSubmit = async (data) => {
    setError("")
    try {
      await updateProfile(data)
      toast.success("Perfil actualizado")
    } catch (requestError) {
      const message = getErrorMessage(requestError)
      setError(message)
      toast.error(message)
    }
  }

  return <PageLayout><PageHeader title="Mi perfil" description="Consulta y edita la información de tu cuenta." /><section className="section auth-section"><div className="container"><div className="auth-card"><span className="eyebrow">Información personal</span><h2>Mis datos</h2><p>Mantén tus datos personales actualizados.</p>{error && <div className="form-error">{error}</div>}<form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate><div className="form-grid"><div className="form-field"><label htmlFor="username">Nombre</label><input id="username" {...register("username", { required: "El nombre es obligatorio" })} />{errors.username && <p className="field-error">{errors.username.message}</p>}</div><div className="form-field"><label htmlFor="lastName">Apellidos</label><input id="lastName" {...register("lastName")} /></div></div><div className="form-field"><label htmlFor="email">Correo electrónico</label><input id="email" type="email" {...register("email", { required: "El correo es obligatorio", pattern: { value: /^\S+@\S+\.\S+$/, message: "Ingresa un correo válido" } })} />{errors.email && <p className="field-error">{errors.email.message}</p>}</div><div className="form-field"><label htmlFor="number">Teléfono</label><input id="number" type="tel" {...register("number")} /></div><button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="spin" size={16} /> Guardando...</> : "Guardar cambios"}</button></form></div></div></section></PageLayout>
}
