import { getEntityWorldPosition } from '@dcl/ecs-scene-utils'
import * as ui from '@dcl/ui-scene-utils'

const ghost = new Entity()
ghost.addComponent(
  new Transform({
    position: new Vector3(5, 0, 5)
  })
)
ghost.addComponent(new GLTFShape('models/ghost1.glb'))

engine.addEntity(ghost)
ghost.setParent(Attachable.AVATAR)

Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, true, (e) => {
  const physicsCast = PhysicsCast.instance

  const originPos = Camera.instance.position.clone()
  const targetPos = getEntityWorldPosition(ghost) // NOTE: We need to get the world position because ghost entity is child of the Avatar

  log('ray created from:', originPos, 'to:', targetPos)
  const rayFromPoints = physicsCast.getRayFromPositions(originPos, targetPos)

  physicsCast.hitFirst(rayFromPoints, (e) => {
    log('hit:', e)
    if (e.didHit) {
      ghostNotInSight()
      log('HIT ENTITY: ', e.entity)
    } else {
      ghostInSight()
    }
  })
})

function ghostInSight() {
  ui.displayAnnouncement('Ghost in plain view!')
}

function ghostNotInSight() {
  ui.displayAnnouncement('...No Ghosts in sight')
}
