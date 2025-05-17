import streamlit as st

st.title("Orbital Velocity Calculator")

st.markdown("This calculates the orbital velocity for a circular orbit using:")
st.latex("v = \\sqrt{\\frac{GM}{r}}")

G = 6.67430e-11  # gravitational constant

mass = st.number_input("Mass of central body (kg)", value=5.972e24)  # Earth
radius = st.number_input("Orbital radius (m)", value=6.371e6 + 400e3)  # Earth radius + 400km

if mass > 0 and radius > 0:
    velocity = (G * mass / radius) ** 0.5
    st.success(f"Orbital Velocity: {velocity:.2f} m/s")
else:
    st.warning("Please enter positive values for both mass and radius.")