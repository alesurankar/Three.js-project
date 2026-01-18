export class StarSystem
{
    static TimeScale = 10;
    static OrbitalRotationInDays(days, scale = StarSystem.TimeScale) 
    {
        const seconds = days * 24 * 60 * 60;
        return (2 * Math.PI / seconds) * scale;
    }
    static AxialRotationInDays(days, scale = StarSystem.TimeScale) 
    {
        const seconds = days * 24 * 60 * 60;
        return (2 * Math.PI / seconds) * scale;
    }
}