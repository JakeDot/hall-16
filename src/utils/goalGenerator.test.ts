import { describe, it, expect } from 'bun:test';
import { generateDailyShiftGoals, getDepartmentMissionsForRole } from './goalGenerator';
import { RoleGroup } from '../types/game';

describe('goalGenerator', () => {
  describe('generateDailyShiftGoals', () => {
    const allRoleGroups: RoleGroup[] = ['nurse', 'patient', 'doctor', 'cantina', 'janitor', 'director'];

    it('should generate goals for Day 1 (day = 1, daySeed = 1)', () => {
      const goals = generateDailyShiftGoals(1);

      expect(goals).toHaveLength(6);
      expect(goals[0].id).toContain('1');
      expect(goals[0].title).toBe('Administer Ward Medications');

      const roleGroupsInGoals = goals.map((g) => g.roleGroup);
      for (const role of allRoleGroups) {
        expect(roleGroupsInGoals).toContain(role);
      }

      goals.forEach((goal) => {
        expect(goal.currentProgress).toBe(0);
        expect(goal.completed).toBe(false);
        expect(goal.rewardXp).toBeGreaterThan(0);
        expect(goal.icon).toBeDefined();
      });
    });

    it('should generate goals for Day 2 (daySeed = 2)', () => {
      const goals = generateDailyShiftGoals(2);

      expect(goals).toHaveLength(6);
      expect(goals[0].id).toContain('2');
      expect(goals[0].title).toBe('Ward Vitals Stabilization');

      const roleGroupsInGoals = goals.map((g) => g.roleGroup);
      for (const role of allRoleGroups) {
        expect(roleGroupsInGoals).toContain(role);
      }
    });

    it('should generate goals for Day 3 (daySeed = 0)', () => {
      const goals = generateDailyShiftGoals(3);

      expect(goals).toHaveLength(6);
      expect(goals[0].id).toContain('3');
      expect(goals[0].title).toBe('Full Ward Routine Meds');

      const roleGroupsInGoals = goals.map((g) => g.roleGroup);
      for (const role of allRoleGroups) {
        expect(roleGroupsInGoals).toContain(role);
      }
    });

    it('should generate goals for Day 4 (daySeed = 1, day != 1)', () => {
      const goals = generateDailyShiftGoals(4);

      expect(goals).toHaveLength(6);
      expect(goals[0].id).toContain('4');
      expect(goals[0].title).toBe('Administer Ward Medications');
    });

    it('should format all goal IDs dynamically with the passed day parameter', () => {
      const day = 7;
      const goals = generateDailyShiftGoals(day);

      goals.forEach((goal) => {
        expect(goal.id).toContain(`_${day}_`);
      });
    });
  });

  describe('getDepartmentMissionsForRole', () => {
    const rolesToTest: RoleGroup[] = ['nurse', 'patient', 'doctor', 'cantina', 'janitor', 'director'];

    rolesToTest.forEach((role) => {
      it(`should return department missions for role: ${role}`, () => {
        const missions = getDepartmentMissionsForRole(role);

        expect(missions.length).toBeGreaterThan(0);
        missions.forEach((mission) => {
          expect(mission.id).toBeDefined();
          expect(mission.title).toBeDefined();
          expect(mission.description).toBeDefined();
          expect(mission.targetCount).toBeGreaterThan(0);
          expect(mission.rewardXp).toBeGreaterThan(0);
          expect(mission.rewardCredits).toBeGreaterThan(0);
          expect(mission.icon).toBeDefined();
        });
      });
    });

    it('should fallback to nurse missions for unknown or invalid role group', () => {
      const unknownRoleMissions = getDepartmentMissionsForRole('invalid_role' as RoleGroup);
      const nurseMissions = getDepartmentMissionsForRole('nurse');

      expect(unknownRoleMissions).toEqual(nurseMissions);
    });
  });
});
