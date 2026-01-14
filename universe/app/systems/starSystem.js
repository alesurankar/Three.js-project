export class StarSystem 
{
    static TimeScale = 500;
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

    constructor (scene) 
    {
        this.scene = scene;
        this.bodies = [];
        this.bodiesMap = {};
    }

    
    AddBody(body) 
    {
        this.bodies.push(body);
        if (!body.parent) this.scene.add(body.orbitPivot);
        //this.bodiesMap = body;
    }

    Update() 
    {
        for (const body of this.bodies) {
            body.Update();
        }
    }
}